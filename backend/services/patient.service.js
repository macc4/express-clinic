import db from '../db/sequelize.js';

const createOne = async body => {
  const newPatient = await db.patients.create(body);

  return newPatient;
};

const getOne = async id => {
  // const options = {
  //   include: {
  //     model: db.resolutions,
  //     attributes: ['id', 'resolution', 'createdAt', 'updatedAt'],
  //   },
  // };

  // uncomment the above part to embed all of the resolutions to the patient GET request
  const options = {};

  const patient = await db.patients.findByPk(id, options);

  return patient;
};

const getAll = async query => {
  const queryConditions = {};

  if (query.name) {
    queryConditions.name = {
      [db.Sequelize.Op.like]: `'%${query.name}%`,
    };
  }

  const patients = await db.patients.findAll({
    where: queryConditions,
  });

  return patients;
};

const deleteOne = async id => {
  const deletedPatient = await db.patients.destroy({
    where: { id: id },
  });

  return deletedPatient;
};

export default { createOne, getOne, getAll, deleteOne };
