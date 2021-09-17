import { StatusCodes } from 'http-status-codes';
import config from 'config';

import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';
import passwordUtils from '../utils/passwordUtils.js';
import JWTUtils from '../utils/jwtUtils.js';
import dateUtils from '../utils/dateUtils.js';

import patientService from '../services/patient.service.js';
import userService from '../services/user.service.js';
import Roles from '../utils/roles.js';

const createSendToken = (user, statusCode, res) => {
  const token = JWTUtils.sign(
    user.id,
    config.get('security.jwt_secret'),
    config.get('security.jwt_expiry'),
  );

  const cookieOptions = {
    expires: dateUtils.getUnixFromDays(
      config.get('security.jwt_cookie_expiresIn'),
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  // destructuring for security reasons, so body won't receive an admin role by POST req
  const { name, email, password, passwordConfirm, gender, birthday } = req.body;
  const id = Roles.PATIENT;

  const samePasswords = passwordUtils.comparePasswords(
    password,
    passwordConfirm,
  );

  if (!samePasswords) {
    return next(
      new AppError('Passwords are not the same!', StatusCodes.FORBIDDEN),
    );
  }

  const userBody = { name, email, password, role: id };
  const newUser = await userService.create(userBody);

  // automatically create a corresponding patient
  const patientBody = { name, gender, birthday, userId: newUser.id };
  await patientService.create(patientBody);

  // don't send sensitive data
  newUser.password = undefined;
  newUser.passwordConfirm = undefined;
  newUser.passwordChangedAt = undefined;

  createSendToken(newUser, StatusCodes.CREATED, res);
});

const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if the email and the password exist
  if (!email || !password) {
    return next(
      new AppError(
        'Please, provide email and password!',
        StatusCodes.BAD_REQUEST,
      ),
    );
  }

  // 2) check if the user exists and password is correct
  const user = await userService.getByEmail(email);

  if (!user || !(await passwordUtils.verifyPassword(password, user.password))) {
    return next(
      new AppError('Incorrect email or password!', StatusCodes.UNAUTHORIZED),
    );
  }

  // don't send sensitive data
  user.password = undefined;
  user.passwordConfirm = undefined;
  user.passwordChangedAt = undefined;

  // 3) send data and the token to the client
  createSendToken(user, StatusCodes.OK, res);
});

const signOut = (req, res) => {
  res.cookie('jwt', 'signed-out', {
    expires: dateUtils.getUnixOneMin(),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ status: 'success' });
};

// protect routes for only authorized users
const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!', StatusCodes.UNAUTHORIZED),
    );
  }

  // 2) Verificate the token

  const decoded = await JWTUtils.decode(
    token,
    config.get('security.jwt_secret'),
  );

  if (!decoded) {
    return next(
      new AppError('You are not logged in!', StatusCodes.UNAUTHORIZED),
    );
  }

  // 3) Check if the user still exists
  const freshUser = await userService.getByID(decoded.id);

  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token no longer exists.',
        StatusCodes.UNAUTHORIZED,
      ),
    );
  }

  // not working due to recent sequelize detachment from user.service, requires a separate method now instead of the model.instance method
  // 4) Check if the user has changed the password after the token was issued

  // if (freshUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError(
  //       'The password has been changed recently, please, login again!',
  //       StatusCodes.UNAUTHORIZED,
  //     ),
  //   );
  // }

  // don't send sensitive data
  freshUser.password = undefined;
  freshUser.passwordConfirm = undefined;
  freshUser.passwordChangedAt = undefined;

  // put the user data into the request for the next controllers
  req.user = freshUser;

  // GRANT ACCESS TO PROTECTED ROUTE
  next();
});

// only for rendered pages
const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1) Verify the token
      const decoded = await JWTUtils.decode(
        req.cookies.jwt,
        config.get('security.jwt_secret'),
      );

      // 2) Check if the user still exists

      const currentUser = await userService.getByID(decoded.id);

      if (!currentUser) {
        return next();
      }

      // not working due to recent sequelize detachment from user.service, requires a separate method now instead of the model.instance method
      // 3) Check if the user has changed the password after the token was issued

      // if (currentUser.changedPasswordAfter(decoded.iat)) {
      //   return next();
      // }

      // don't send sensitive data
      currentUser.password = undefined;
      currentUser.passwordConfirm = undefined;
      currentUser.passwordChangedAt = undefined;

      // put the user data into the request for the next controllers
      req.user = currentUser;
      // put data into locals so the templates would have access to user data (to render different pages if the user has signed-in or not)
      res.locals.user = currentUser;

      return next();
    }
  } catch {
    return next();
  }
  next();
};

// restrict routes to specific roles
const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user['roles.id'])) {
      return next(
        new AppError(
          'You do not have permission to perform this action.',
          StatusCodes.FORBIDDEN,
        ),
      );
    }

    next();
  };

export default { signUp, signIn, signOut, protect, restrictTo, isLoggedIn };
