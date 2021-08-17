export default class ResolutionController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddResolution(this.handleAddResolution);
    this.view.bindPatientSearchResolution(this.handlePatientSearchResolution);
    this.view.bindDoctorSearchResolution(this.handleDoctorSearchResolution);
    this.view.bindDeleteEntry(this.handleDeleteEntry);
  }

  handleAddResolution = async (resolution) => {
    try {
      const patient = await this.model.queueModel.peek(1);
      this.model.create(patient.name, patient.expiry, resolution);
      this.model.queueModel.dequeue(1);
    } catch (error) {
      this.view.showError(error);
    }
  };

  handlePatientSearchResolution = async (name) => {
    try {
      const patient = await this.model.search(name);
      this.view.patientShowResolution(patient.resolution);
    } catch (error) {
      this.view.patientShowResolution('There is no patient with such name.');
    }
  };

  handleDoctorSearchResolution = async (name) => {
    try {
      const patient = await this.model.search(name);
      this.view.doctorShowResolution(patient.resolution);
    } catch (error) {
      this.view.doctorShowResolution('There is no patient with such name.');
    }
  };

  handleDeleteEntry = async (name) => {
    try {
      await this.model.delete(name);
    } catch (error) {
      this.view.showError(error);
    }
  };
}
