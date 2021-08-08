class ResolutionView {
  constructor() {
    this.patientSearchInput = document.getElementById('patient-search-input');
    this.patientSearchResults = document.getElementById(
      'patient-search-results'
    );

    this.doctorFormResolution = document.getElementById(
      'doctor-form-resolution'
    );
    this.doctorResolutionInput = document.getElementById(
      'doctor-resolution-input'
    );

    this.doctorSearchInput = document.getElementById('doctor-search-input');
    this.doctorButtonSearch = document.getElementById('doctor-search-button');
    this.doctorSearchResults = document.getElementById('doctor-search-results');
    this.doctorButtonDelete = document.getElementById('doctor-delete-button');
  }

  patientShowResolution(resolution) {
    this.patientSearchResults.value = resolution;
  }

  doctorShowResolution(resolution) {
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
