class PatientsQueueController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddPatient(this.handleAddPatient);
    this.view.bindSelectTheNextPatient(this.handleSelectTheNextPatient);
    this.view.bindProcessPatient(this.handleProcessPatient);
  }

  handleAddPatient = (patientName, timeToLive) => {
    try {
      this.model.addPatient(patientName, timeToLive);
    } catch (error) {
      this.view.showError(error);
    }
  };

  handleSelectTheNextPatient = () => {
    try {
      this.model.selectTheNextPatient();
      this.view.showCurrentPatient(
        this.model.patients[this.model.selectedPatientIndex].name
      );
    } catch (error) {
      this.view.showError(error);
    }
  };

  handleProcessPatient = () => {
    try {
      this.model.processPatient();
    } catch (error) {
      this.view.showError(error);
    }
  };
}
