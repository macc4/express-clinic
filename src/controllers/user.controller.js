import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { AppError } from '../utils/errorClasses.js';
import catchAsync from '../utils/catchAsync.js';
import userService from '../services/user.service.js';

const getMe = (req, res, next) => {
  req.params.userId = req.user.id;
  next();
};

//
// following control functions are not used in frontend but can be added later
//

// can be used to create doctor/admin accounts
const createUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined! Please, use /signup instead.',
  });
};

// not used
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAll(req.query);

  if (users.length === 0) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  users.forEach(user => {
    // don't send sensitive data
    user.password = undefined;
    user.passwordConfirm = undefined;
    user.passwordChangedAt = undefined;
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// not used
const getUserByID = catchAsync(async (req, res, next) => {
  const user = await userService.getByID(req.params.userId);

  if (!user) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  // don't send sensitive data
  user.password = undefined;
  user.passwordConfirm = undefined;
  user.passwordChangedAt = undefined;

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

// not used
const deleteUserByID = catchAsync(async (req, res, next) => {
  const user = await userService.deleteByID(req.params.userId);

  if (!user) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export default { getMe, createUser, getAllUsers, getUserByID, deleteUserByID };
