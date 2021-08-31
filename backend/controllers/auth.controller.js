import { promisify } from 'util';
// import { StatusCodes, getReasonPhrase } from 'http-status-codes';
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

const signup = catchAsync(async (req, res, next) => {
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

  createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if the email and the password exist
  if (!email || !password) {
    return next(new AppError('Please, provide email and password!', 400));
  }

  // 2) check if the user exists and passwords is correct
  const user = await db.users.findOne({
    where: { email: email },
  });

  if (
    !user ||
    !(await db.users.correctPassword(password, user.dataValues.password))
  ) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  // don't send back the data
  user.dataValues.password = undefined;
  user.dataValues.passwordConfirm = undefined;
  user.dataValues.passwordChangedAt = undefined;

  // 3) send data and the token to the client
  createSendToken(user, 200, res);
});

// protect routes for certain roles
const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in!', 401));
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
      new AppError('The user belonging to this token no longer exists.', 401),
    );
  }

  // 4) Check if the user has changed the password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The password has been changed recently, please, login again!',
        401,
      ),
    );
  }

  // don't send back the password
  freshUser.dataValues.password = undefined;

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});

// restrict routes to specific roles
const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403),
      );
    }

    next();
  };

export default { signup, login, protect, restrictTo };
