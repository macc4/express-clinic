export default class QueueSQLService {
  constructor(database) {
    this.db = database;
    this.Queue = this.db.queue;
    this.Sequelize = this.db.Sequelize;
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

    return patient[0];
  }

  async dequeue() {
    const patient = await this.peek();

    // somehow patient[0].dataValues.patientId cannot be accessed otherwise
    const data = {
      patient: patient,
    };

    if (patient.length !== 0) {
      const id = data.patient.dataValues.patientId;
      await this.Queue.destroy({
        where: { patientId: id },
      });
    }

    return patient;
  }
}
