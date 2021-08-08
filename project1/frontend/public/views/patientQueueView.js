class PatientsQueueView {
  constructor() {
    this.patientCurrentPatient = document.getElementById(
      'current-patient-patient'
    );

    this.patientForm = document.getElementById('patient-form');
    this.patientFormInput = document.getElementById('patient-form-input');
    this.patientFormTTL = document.getElementById('patient-form-ttl');

    this.doctorCurrentPatient = document.getElementById(
      'current-patient-doctor'
    );

    this.doctorButtonNext = document.getElementById('doctor-next-button');

    this.doctorFormResolution = document.getElementById(
      'doctor-form-resolution'
    );
    this.doctorResolutionInput = document.getElementById(
      'doctor-resolution-input'
    );
  }

  showCurrentPatient(patientName) {
    const patientNameCapitalized =
      patientName.charAt(0).toUpperCase() + patientName.slice(1);

    this.patientCurrentPatient.innerHTML = patientNameCapitalized;
    this.doctorCurrentPatient.innerHTML = patientNameCapitalized;
  }

  get _patientName() {
    return this.patientFormInput.value;
  }

  _resetPatientName() {
    this.patientFormInput.value = '';
  }

  get _patientTTL() {
    return this.patientFormTTL.value;
  }

  _resetPatientTTL() {
    this.patientFormTTL.value = '';
  }

  get _resolution() {
    return this.doctorResolutionInput.value;
  }

  bindAddPatient(handler) {
    this.patientForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this._patientName) {
        handler(this._patientName, this._patientTTL);
        this._resetPatientName();
        this._resetPatientTTL();
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
