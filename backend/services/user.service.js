import db from '../db/sequelize.js';

const getAll = async query => {
  const queryConditions = {};

  if (query.role) {
    queryConditions.role = {
      [db.Sequelize.Op.like]: `%${query.role}%`,
    };
  }

  const users = await db.users.findAll({
    attributes: {
      exclude: ['password', 'passwordConfirm', 'passwordChangedAt'],
    },
    where: queryConditions,
  });

  return users;
};

// PLACEHOLDER FUNCTIONS
const createOne = async body => {
  const user = await db.users.create(body);

  return user;
};

const getOne = async id => {
  const user = await db.user.findByPk(id);

  return user;
};

const deleteOne = async id => {
  const deletedUser = await db.users.destroy({
    where: { id: id },
  });

  return deletedUser;
};

export default { createOne, getOne, getAll, deleteOne };
