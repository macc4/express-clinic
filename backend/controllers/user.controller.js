import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';

import userService from '../services/user.service.js';

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAll(req.query);

  if (users.length === 0) {
    const statusCode = StatusCodes.NOT_FOUND;
    return next(new AppError('Users not found', statusCode));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      users,
    },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});

const getUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});

export default { createUser, getUser, getAllUsers, deleteUser };
