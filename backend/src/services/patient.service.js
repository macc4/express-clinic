import db from '../db/sequelize.js';

const createOne = async body => {
  const newPatient = await db.patients.create(body);

  return newPatient;
};

// eslint-disable-next-line no-unused-vars
const getAll = async query => {
  const queryConditions = {};

  // not used since our Patients entity doesn't really contain any data right now

  // if (query.name) {
  //   queryConditions.name = {
  //     [db.Sequelize.Op.like]: `'%${query.name}%`,
  //   };
  // }

  const patients = await db.patients.findAll({
    where: queryConditions,
  });

  return patients;
};

const getOne = async params => {
  const patient = await db.patients.findByPk(params.patientId);

  return patient;
};

const deleteOne = async params => {
  const deletedPatient = await db.patients.destroy({
    where: { id: params.patientId },
  });

  return deletedPatient;
};

export default { createOne, getOne, getAll, deleteOne };
