export default class PatientSQLService {
  constructor(database) {
    this.db = database;
    this.Patient = this.db.patients;
    this.Sequelize = this.db.Sequelize;
  }

  async createPatient(body) {
    const newPatient = await this.Patient.create(body);

    return newPatient;
  }

  async getPatient(patientId) {
    const patient = await this.Patient.findByPk(patientId, {
      include: 'resolutions', // THIS IS OPTIONAL
    });

    return patient;
  }

  async getAllPatients(query) {
    // TODO create a separate function for querying and add more options

    const queryConditions = {};

    if (query.name) {
      queryConditions.name = {
        [this.Sequelize.Op.like]: '%' + query.name + '%',
      };
    }

    const patients = await this.Patient.findAll({
      where: queryConditions,
      // include: 'resolutions', // THIS IS OPTIONAL
    });

    return patients;
  }

  async deletePatient(patientId) {
    const deletedPatient = await this.Patient.destroy({
      where: { id: patientId },
    });

    return deletedPatient;
  }
}
