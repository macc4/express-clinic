import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import config from 'config';

import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

import db from '../db/sequelize.js';

const signToken = id =>
  jwt.sign({ id }, config.get('security.jwt_secret'), {
    expiresIn: config.get('security.jwt_expiry'),
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.dataValues.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        config.get('security.jwt_cookie_expiresIn') * 24 * 60 * 60 * 1000,
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
  // for security reasons, so body won't receive an admin role by POST req
  const body = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };

  const newUser = await db.users.create(body);

  // don't send back the password
  newUser.dataValues.password = undefined;

  createSendToken(newUser, StatusCodes.CREATED, res);
});

const login = catchAsync(async (req, res, next) => {
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

  // 2) check if the user exists and passwords is correct
  const user = await db.users.findOne({
    where: { email: email },
  });

  if (
    !user ||
    !(await db.users.correctPassword(password, user.dataValues.password))
  ) {
    return next(
      new AppError('Incorrect email or password!', StatusCodes.UNAUTHORIZED),
    );
  }

  // don't send back the data
  user.dataValues.password = undefined;
  user.dataValues.passwordConfirm = undefined;
  user.dataValues.passwordChangedAt = undefined;

  // 3) send data and the token to the client
  createSendToken(user, StatusCodes.OK, res);
});

const signOut = (req, res) => {
  res.cookie('jwt', 'signed-out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ status: 'success' });
};

// protect routes for certain roles
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
  const decoded = await promisify(jwt.verify)(
    token,
    config.get('security.jwt_secret'),
  );

  // 3) Check if the user still exists
  const freshUser = await db.users.findByPk(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token no longer exists.',
        StatusCodes.UNAUTHORIZED,
      ),
    );
  }

  // 4) Check if the user has changed the password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The password has been changed recently, please, login again!',
        StatusCodes.UNAUTHORIZED,
      ),
    );
  }

  // don't send back the password
  freshUser.dataValues.password = undefined;

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
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        config.get('security.jwt_secret'),
      );
      // 2) Check if the user still exists
      const currentUser = await db.users.findByPk(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if the user has changed the password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // don't send back the password
      currentUser.dataValues.password = undefined;

      // put the user data into the request and locals for the next controllers
      req.user = currentUser;
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
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action.',
          StatusCodes.FORBIDDEN,
        ),
      );
    }

    next();
  };

export default { signUp, login, signOut, protect, restrictTo, isLoggedIn };
