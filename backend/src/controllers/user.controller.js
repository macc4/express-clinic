import factory from './handler.factory.js';
import userService from '../services/user.service.js';

const createUser = factory.createOne(userService);
const getAllUsers = factory.getAll(userService);
const getUser = factory.getOne(userService);
const deleteUser = factory.deleteOne(userService);

export default { createUser, getUser, getAllUsers, deleteUser };
