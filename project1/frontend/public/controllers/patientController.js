class ResolutionController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddResolution(this.handleAddResolution);
    this.view.bindPatientSearchResolution(this.handlePatientSearchResolution);
    this.view.bindDoctorSearchResolution(this.handleDoctorSearchResolution);
    this.view.bindDeleteEntry(this.handleDeleteEntry);
  }

  handleGetCurrentPatient = () => {
    try {
      this.model.getCurrentPatient();
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

  handleDeleteEntry = (patientName) => {
    try {
      this.model.deleteEntry(patientName);
    } catch (error) {
      this.view.showError(error);
    }
  };
}
