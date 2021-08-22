import db from '../../db/sequelize.js';

export default class QueueSQLService {
  constructor() {
    this.db = db;
    this.Queue = db.queue;
    this.Sequelize = db.Sequelize;
  }

  async enqueue(body) {
    const newPatient = await this.Queue.create(body);

    return newPatient;
  }

  async peek() {
    const patient = await this.Queue.findAll({
      limit: 1,
      order: [['updatedAt', 'ASC']],
    });

    return patient;
  }

  async dequeue() {
    const patient = await this.peek();

    // somehow patient[0].dataValues.patientId cannot be accessed otherwise
    const data = {
      patient: patient[0],
    };

    if (patient.length !== 0) {
      const id = data.patient.dataValues.patientId;
      await this.Queue.destroy({
        where: { patientId: id },
      });
    }

    return patient[0];
  }
}
