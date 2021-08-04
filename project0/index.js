// implementation was based on the MVC pattern

class PatientsQueueModel {
  constructor() {
    this.patients = [];
    this.emptyPatient = {
      name: undefined,
      isProcessed: false,
    };
    this.selectedPatientIndex = undefined;
  }

  _currentPatientName() {
    return this.patients[this.selectedPatientIndex].name;
  }

  addPatient(patientName) {
    const duplicatePatient = this.patients.some((patient) => patient.name === patientName.toLowerCase());

    if (!duplicatePatient) {
      const patient = {
        ...this.emptyPatient,
        name: patientName.toLowerCase(),
      };

      this.patients.push(patient);
    } else {
      throw Error('You are already in the queue.');
    }
  }

  selectTheNextPatient() {
    // filter already processed patients
    this.patients = this.patients.filter((patient) => patient.isProcessed === false);

    this.selectedPatientIndex = this.patients.findIndex((patient) => patient.isProcessed === false);
    console.log(`current index: ${this.selectedPatientIndex}`);

    if (this.selectedPatientIndex === undefined || this.selectedPatientIndex === -1) {
      throw Error('There are no patients left.');
    }

    console.log(this.patients);
  }

  processPatient() {
    if (this.selectedPatientIndex === undefined) {
      throw Error('Please, select the patient first.');
    }

    this.patients[this.selectedPatientIndex].isProcessed = true;
  }
}

class PatientsQueueView {
  constructor() {
    this.patientCurrentPatient = document.getElementById('current-patient-patient');

    this.patientForm = document.getElementById('patient-form');
    this.patientFormInput = document.getElementById('patient-form-input');

    this.doctorCurrentPatient = document.getElementById('current-patient-doctor');

    this.doctorButtonNext = document.getElementById('doctor-next-button');

    this.doctorFormResolution = document.getElementById('doctor-form-resolution');
    this.doctorResolutionInput = document.getElementById('doctor-resolution-input');
  }

  showCurrentPatient(patientName) {
    const patientNameCapitalized = patientName.charAt(0).toUpperCase() + patientName.slice(1);

    this.patientCurrentPatient.innerHTML = patientNameCapitalized;
    this.doctorCurrentPatient.innerHTML = patientNameCapitalized;
  }

  get _patientName() {
    return this.patientFormInput.value;
  }

  _resetPatientName() {
    this.patientFormInput.value = '';
  }

  get _resolution() {
    return this.doctorResolutionInput.value;
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

  bindProcessPatient(handler) {
    this.doctorFormResolution.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this._resolution) {
        handler(this._resolution);
      }
    });
  }

  showError(error) {
    console.error(error);
    alert(error);
  }
}

class PatientsQueueController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddPatient(this.handleAddPatient);
    this.view.bindSelectTheNextPatient(this.handleSelectTheNextPatient);
    this.view.bindProcessPatient(this.handleProcessPatient);
  }

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
      this.view.showCurrentPatient(this.model.patients[this.model.selectedPatientIndex].name);
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

class ResolutionModel {
  constructor(queueModel) {
    this.queueModel = queueModel;
    this.database = [];
    this.entryScheme = {
      id: undefined,
      name: undefined,
      resolution: undefined,
    };
    this.currentPatientName = undefined;
    this.searchedResolution = '';
  }

  addResolution(resolution) {
    this.currentPatientName = this.queueModel._currentPatientName();

    console.log(`testtest ${this.currentPatientName}`);

    if (this.currentPatientName === undefined) {
      throw Error('Please, select the patient first!');
    }

    // check if the patient was here before, if yes, then add on to the resolution
    const currentPatientIndex = this.database.findIndex(
      (patient) => patient.name === this.currentPatientName.toLowerCase()
    );

    if (this.database[currentPatientIndex] !== undefined) {
      this.database[currentPatientIndex].resolution += `\n\n${resolution}`;
    } else {
      const entry = {
        id: this.database.length > 0 ? this.database[this.database.length - 1].id + 1 : 1,
        name: this.currentPatientName.toLowerCase(),
        resolution: resolution,
      };

      this.database.push(entry);
    }

    console.log(this.database);
  }

  searchResolution(patientName) {
    const currentPatientSearchIndex = this.database.findIndex((patient) => patient.name === patientName.toLowerCase());
    if (currentPatientSearchIndex === -1) {
      throw Error('There is no patient with such name!');
    }

    this.searchedResolution = this.database[currentPatientSearchIndex].resolution;

    console.log(this.database);
  }

  deleteEntry(patientName) {
    const currentPatientSearchIndex = this.patients.findIndex((patient) => patient.name === patientName.toLowerCase());
    if (currentPatientSearchIndex === -1) {
      throw Error('There is no patient with such name!');
    }

    this.database = this.database.filter((patient) => patient.name !== patientName.toLowerCase());

    console.log(this.database);
  }
}

class ResolutionView {
  constructor() {
    this.patientSearchInput = document.getElementById('patient-search-input');
    this.patientSearchResults = document.getElementById('patient-search-results');

    this.doctorFormResolution = document.getElementById('doctor-form-resolution');
    this.doctorResolutionInput = document.getElementById('doctor-resolution-input');

    this.doctorSearchInput = document.getElementById('doctor-search-input');
    this.doctorButtonSearch = document.getElementById('doctor-search-button');
    this.doctorSearchResults = document.getElementById('doctor-search-results');
    this.doctorButtonDelete = document.getElementById('doctor-delete-button');
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

  bindDeleteEntry(handler) {
    this.doctorButtonDelete.addEventListener('click', () => {
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

const patientsQueueModel = new PatientsQueueModel();
const resolutionModel = new ResolutionModel(patientsQueueModel);

const patientsQueue = new PatientsQueueController(patientsQueueModel, new PatientsQueueView());
const resolutions = new ResolutionController(resolutionModel, new ResolutionView());
