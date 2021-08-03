export default class QueueController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddPatient(this.handleAddPatient);
    this.view.bindSelectTheNextPatient(this.handleSelectTheNextPatient);
    this.view.bindAddResolution(this.handleAddResolution);
    this.view.bindPatientSearchResolution(this.handlePatientSearchResolution);
    this.view.bindDoctorSearchResolution(this.handleDoctorSearchResolution);
    this.view.bindDeletePatient(this.handleDeletePatient);
  }

  showCurrentPatient = (patientName) => {
    this.view.showCurrentPatient(patientName);
  };

  handleAddPatient = (patientName) => {
    try {
      this.model.addPatient(patientName);
    } catch (error) {
      this.view.showError(error);
    }
  };

  handleSelectTheNextPatient = () => {
    try {
      this.model.selectTheNextPatient();
      this.showCurrentPatient(this.model.currentPatientName);
    } catch (error) {
      this.view.showError(error);
    }
  };

  handleAddResolution = (patientName, resolution) => {
    try {
      this.model.addResolution(patientName, resolution);
    } catch (error) {
      this.view.showError(error);
    }
  };

  handlePatientSearchResolution = (patientName) => {
    try {
      this.model.searchResolution(patientName);
      this.view.patientShowResolution(this.model.searchedResolution);
    } catch (error) {
      this.view.showError(error);
    }
  };

  handleDoctorSearchResolution = (patientName) => {
    try {
      this.model.searchResolution(patientName);
      this.view.doctorShowResolution(this.model.searchedResolution);
    } catch (error) {
      this.view.showError(error);
    }
  };

  handleDeletePatient = (patientName) => {
    try {
      this.model.deletePatient(patientName);
    } catch (error) {
      this.view.showError(error);
    }
  };
}
