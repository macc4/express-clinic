import sequelize from './clients/sequelize.client.js';

export class SequelizeResolutionStorage {
  constructor(client) {
    this.client = client;
  }

  async createOne(body) {
    const { expiry } = body;

    if (expiry > 0) {
      body.expiry = new Date(expiry);
    } else {
      body.expiry = null;
    }

    const data = await this.client.resolutions
      .create(body)
      .then(result => result.get({ plain: true }));

    return data;
  }

  async getAll(query) {
    const queryConditions = {};

    if (query.patientId) {
      queryConditions.patientId = {
        [this.client.Sequelize.Op.eq]: `${query.patientId}`,
      };
    }

    const resolutions = await this.client.resolutions.findAll({
      raw: true,
      where: queryConditions,
    });

    return resolutions;
  }

  async getByPatientName(name) {
    const query = `
    SELECT resolutions.id, resolutions.resolution, resolutions.createdAt, resolutions.expiry,
    (SELECT doctors.name FROM doctors WHERE doctors.id = ds.doctorId) AS doctorName,
    (SELECT specializations.title FROM specializations WHERE specializations.id = ds.specializationId) AS specialization
    FROM resolutions
    INNER JOIN patients
      ON patients.id=resolutions.patientId
    LEFT OUTER JOIN 
      (
        doctor_specializations ds 
          INNER JOIN doctors ON ds.doctorId=doctors.id
          INNER JOIN specializations ON ds.specializationId=specializations.id
      )
      ON resolutions.doctorId=ds.doctorId
    WHERE patients.name="${name}"
    AND (
      resolutions.expiry IS NULL
      OR resolutions.expiry > Now() 
    )
    `;

    const resolutions = await this.client.sequelize.query(query, {
      raw: true,
      type: this.client.Sequelize.QueryTypes.SELECT,
    });

    return resolutions;
  }

  async deleteByID(id) {
    return await this.client.resolutions.destroy({ raw: true, where: { id } });
  }

  async getByID(id) {
    const resolution = await this.client.resolutions.findByPk(id, {
      raw: true,
    });

    return resolution;
  }

  async getByUserID(id) {
    const query = `
    SELECT resolutions.id, resolutions.patientId, resolutions.resolution, resolutions.expiry, resolutions.createdAt, resolutions.updatedAt,
    (SELECT doctors.name FROM doctors WHERE doctors.id = ds.doctorId) AS doctorName,
    (SELECT specializations.title FROM specializations WHERE specializations.id = ds.specializationId) AS specialization
    FROM resolutions
    INNER JOIN patients
      ON patients.id=resolutions.patientId
    LEFT OUTER JOIN 
      (
        doctor_specializations ds 
          INNER JOIN doctors ON ds.doctorId=doctors.id
          INNER JOIN specializations ON ds.specializationId=specializations.id
      )
      ON resolutions.doctorId=ds.doctorId
    WHERE patients.userId="${id}"
    AND (
      resolutions.expiry IS NULL
      OR resolutions.expiry > Now() 
    )
    `;

    const resolutions = await this.client.sequelize.query(query, {
      raw: true,
      type: this.client.Sequelize.QueryTypes.SELECT,
    });

    return resolutions;
  }
}

const sequelizeResolutionStorage = new SequelizeResolutionStorage(sequelize);

export default sequelizeResolutionStorage;
