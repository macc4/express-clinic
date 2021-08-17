import formatName from '../utils/formatName.js';

export default class QueueView {
  constructor() {
    this.patientCurrentPatient = document.getElementById('current-patient-patient');

    this.patientForm = document.getElementById('patient-form');
    this.patientFormInput = document.getElementById('patient-form-input');
    this.patientFormTTL = document.getElementById('patient-form-ttl');

    this.doctorCurrentPatient = document.getElementById('current-patient-doctor');

    this.doctorButtonNext = document.getElementById('doctor-next-button');

    this.doctorFormResolution = document.getElementById('doctor-form-resolution');
    this.doctorResolutionInput = document.getElementById('doctor-resolution-input');
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

  showCurrentPatient(name) {
    if (this.patientCurrentPatient) {
      this.patientCurrentPatient.innerHTML = formatName.capitalizeFromRegularCase(name);
    }
    if (this.doctorCurrentPatient) {
      this.doctorCurrentPatient.innerHTML = formatName.capitalizeFromRegularCase(name);
    }
  }

  bindEnqueue(handler) {
    if (this.patientForm) {
      this.patientForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (this._patientName) {
          handler(this._patientName, this._patientTTL);
          this._resetPatientName();
          this._resetPatientTTL();
        }
      });
    }
  }

  bindShowNextPatient(handler) {
    if (this.doctorButtonNext) {
      this.doctorButtonNext.addEventListener('click', () => {
        handler();
      });
    }
  }

  // dequeue is being called from the resolutions model

  showError(error) {
    console.error(error);
    alert(error);
  }
}
