import db from '../db/sequelize.js';

const createOne = async body => {
  const newResolution = await db.resolutions.create(body);

  return newResolution;
};

const getOne = async id => {
  const resolution = await db.resolutions.findByPk(id);

  return resolution;
};

const getAll = async query => {
  const queryConditions = {};

  if (query.patientId) {
    queryConditions.patientId = {
      [db.Sequelize.Op.like]: `'%${query.patientId}%`,
    };
  }

  const resolutions = await db.resolutions.findAll({
    where: queryConditions,
  });

  return resolutions;
};

const deleteOne = async id => {
  const deletedResolution = await db.resolutions.destroy({
    where: { id: id },
  });

  return deletedResolution;
};

export default {
  createOne,
  getOne,
  getAll,
  deleteOne,
};
