import db from '../db/sequelize.js';

const createOne = async body => {
  const newResolution = await db.resolutions.create(body);

  return newResolution;
};

const getAll = async query => {
  const queryConditions = {};
  if (query.patientId) {
    queryConditions.patientId = {
      [db.Sequelize.Op.eq]: `${query.patientId}`,
    };
  }

  const resolutions = await db.resolutions.findAll({
    where: queryConditions,
  });

  return resolutions;
};

const getOne = async params => {
  const resolution = await db.resolutions.findByPk(params.resolutionId);

  return resolution;
};

const deleteOne = async params => {
  const deletedResolution = await db.resolutions.destroy({
    where: { id: params.resolutionId },
  });

  return deletedResolution;
};

export default {
  createOne,
  getOne,
  getAll,
  deleteOne,
};
