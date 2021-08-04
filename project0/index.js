// implementation was based on the MVC pattern

class QueueModel {
  constructor() {
    this.patients = [];
    this.emptyPatient = {
      id: undefined,
      name: undefined,
      resolution: undefined,
    };
    this.currentPatient = undefined;
    this.searchedResolution = '';
  }

  addPatient(patientName) {
    const duplicatePatient = this.patients.some((patient) => patient.name === patientName.toUpperCase());

    if (!duplicatePatient) {
      const patient = {
        ...this.emptyPatient,
        id: this.patients.length > 0 ? this.patients[this.patients.length - 1].id + 1 : 1,
        name: patientName.toUpperCase(),
      };

      this.patients.push(patient);
    } else {
      throw Error('Database already contains this patient!');
    }
  }

  selectTheNextPatient() {
    const currentPatientIndex = this.patients.findIndex((patient) => patient.resolution === undefined);
    if (currentPatientIndex === -1) {
      throw Error('There are no patients left!');
    }

    if (this.currentPatientId == this.patients[currentPatientIndex].id) {
      throw Error('Add the resolution before moving to the next patient!');
    }

    this.currentPatient = this.patients.filter((patient) => patient.id == this.patients[currentPatientIndex].id)[0];

    console.log(this.patients);
  }

  addResolution(resolution) {
    if (this.currentPatient === undefined) {
      throw Error('Please, select the patient first!');
    }

    this.patients = this.patients.map((patient) =>
      patient.id === this.currentPatient.id ? { id: patient.id, name: patient.name, resolution: resolution } : patient
    );

    console.log(this.patients);
  }

  searchResolution(patientName) {
    const currentPatientSearchIndex = this.patients.findIndex((patient) => patient.name === patientName.toUpperCase());
    if (currentPatientSearchIndex === -1) {
      throw Error('There is no patient with such name!');
    }

    this.searchedResolution = this.patients[currentPatientSearchIndex].resolution;
  }

  deletePatient(patientName) {
    const currentPatientSearchIndex = this.patients.findIndex((patient) => patient.name === patientName.toUpperCase());
    if (currentPatientSearchIndex === -1) {
      throw Error('There is no patient with such name!');
    }

    this.patients = this.patients.filter((patient) => patient.name !== patientName.toUpperCase());
  }
}

class QueueView {
  constructor() {
    this.patientCurrentPatient = document.getElementById('current-patient-patient');

    this.patientForm = document.getElementById('patient-form');
    this.patientFormInput = document.getElementById('patient-form-input');

    this.patientSearchInput = document.getElementById('patient-search-input');
    this.patientSearchResults = document.getElementById('patient-search-results');

    this.doctorCurrentPatient = document.getElementById('current-patient-doctor');

    this.doctorButtonNext = document.getElementById('doctor-next-button');

    this.doctorFormResolution = document.getElementById('doctor-form-resolution');
    this.doctorResolutionInput = document.getElementById('doctor-resolution-input');

    this.doctorSearchInput = document.getElementById('doctor-search-input');
    this.doctorButtonSearch = document.getElementById('doctor-search-button');
    this.doctorSearchResults = document.getElementById('doctor-search-results');
    this.doctorButtonDelete = document.getElementById('doctor-delete-button');
  }

  showCurrentPatient(patientName) {
    const patientNameLowerCase = patientName.toLowerCase();
    const patientNameCapitalized = patientNameLowerCase.charAt(0).toUpperCase() + patientNameLowerCase.slice(1);

    this.patientCurrentPatient.innerHTML = patientNameCapitalized;
    this.doctorCurrentPatient.innerHTML = patientNameCapitalized;
  }

  get _patientName() {
    return this.patientFormInput.value;
  }

  _resetPatientName() {
    this.patientFormInput.value = '';
  }

  patientShowResolution(resolution) {
    console.log(resolution);
    this.patientSearchResults.value = resolution;
  }

  doctorShowResolution(resolution) {
    console.log(resolution);
    this.doctorSearchResults.value = resolution;
  }

  get _resolution() {
    return this.doctorResolutionInput.value;
  }

  _resetResolution() {
    this.doctorResolutionInput.value = '';
  }

  get _patientSearchResolution() {
    return this.patientSearchInput.value;
  }

  _patientResetSearch() {
    this.patientSearchInput.value = '';
  }

  get _doctorSearchResolution() {
    return this.doctorSearchInput.value;
  }

  _doctorResetSearch() {
    this.doctorSearchInput.value = '';
  }

  bindAddPatient(handler) {
    this.patientForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this._patientName) {
        handler(this._patientName);
        this._resetPatientName();
      }
    });
  }

  bindSelectTheNextPatient(handler) {
    this.doctorButtonNext.addEventListener('click', () => {
      handler();
    });
  }

  bindAddResolution(handler) {
    this.doctorFormResolution.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this._resolution) {
        handler(this._resolution);
        this._resetResolution();
      }
    });
  }

  bindPatientSearchResolution(handler) {
    this.patientSearchInput.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        if (this._patientSearchResolution) {
          handler(this._patientSearchResolution);
          this._patientResetSearch();
        }
      }
    });
  }

  bindDoctorSearchResolution(handler) {
    this.doctorButtonSearch.addEventListener('click', () => {
      if (this._doctorSearchResolution) {
        handler(this._doctorSearchResolution);
      }
    });
  }

  bindDeletePatient(handler) {
    this.doctorButtonDelete.addEventListener('click', (event) => {
      if (this._doctorSearchResolution) {
        handler(this._doctorSearchResolution);
        this._doctorResetSearch();
      }
    });
  }

  showError(error) {
    console.error(error);
    alert(error);
  }
}

class QueueController {
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
      this.showCurrentPatient(this.model.currentPatient.name);
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

const queue = new QueueController(new QueueModel(), new QueueView());
