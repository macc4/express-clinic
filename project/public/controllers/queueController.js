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
    this.model.addPatient(patientName);
  };

  handleSelectTheNextPatient = () => {
    this.model.selectTheNextPatient();
    this.showCurrentPatient(this.model.currentPatientName);
  };

  handleAddResolution = (patientName, resolution) => {
    this.model.addResolution(patientName, resolution);
  };

  handlePatientSearchResolution = (patientName) => {
    this.model.searchResolution(patientName);
    this.view.patientShowResolution(this.model.searchedResolution);
  };

  handleDoctorSearchResolution = (patientName) => {
    this.model.searchResolution(patientName);
    this.view.doctorShowResolution(this.model.searchedResolution);
  };

  handleDeletePatient = (patientName) => {
    this.model.deletePatient(patientName);
  };
}
