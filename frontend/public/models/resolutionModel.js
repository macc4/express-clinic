import { convertToBabelCase } from '../utils/formatName.js';

export default class ResolutionModel {
  constructor(queueModel) {
    this.queueModel = queueModel;
    this.apiURL = 'http://localhost:8080/api/v1/resolutions';
  }

  async create(name, expiry, resolution) {
    await axios.post(`${this.apiURL}`, {
      name: name,
      resolution: resolution,
      expiry: expiry,
    });
  }

  async search(name) {
    name = convertToBabelCase(name);
    const response = await axios.get(`${this.apiURL}/${name}`);

    return response.data.data.patient;
  }

  async delete(name) {
    name = convertToBabelCase(name);
    await axios.delete(`${this.apiURL}/${name}`);
  }
}
