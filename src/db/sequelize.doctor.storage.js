import sequelize from './clients/sequelize.client.js';

export class SequelizeDoctorStorage {
  constructor(client) {
    this.client = client;
  }

  async getAll() {
    const doctors = await this.client.doctors.findAll({
      raw: true,
      include: [this.client.specializations],
    });

    return doctors;
  }

  async getByID(id) {
    const doctor = await this.client.doctors.findByPk(id, {
      raw: true,
      include: [this.client.specializations],
    });
    return doctor;
  }

  async getByUserID(userId) {
    const doctor = await this.client.doctors.findOne({
      raw: true,
      where: { userId },
    });
    return doctor;
  }
}

const sequelizeDoctorStorage = new SequelizeDoctorStorage(sequelize);

export default sequelizeDoctorStorage;
