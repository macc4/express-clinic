import { StatusCodes } from 'http-status-codes';
import factory from './handler.factory.js';
import userService from '../services/user.service.js';

const getMe = (req, res, next) => {
  req.params.userId = req.user.id;
  next();
};

const createUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined! Please, use /signup instead.',
  });
};

const getAllUsers = factory.getAll(userService);
const getUserByID = factory.getByID(userService);
const deleteUserByID = factory.deleteByID(userService);

export default { getMe, createUser, getUserByID, getAllUsers, deleteUserByID };
