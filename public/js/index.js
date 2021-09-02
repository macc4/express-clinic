/* eslint-disable */

import '@babel/polyfill';
import { signin, signout } from './auth.js';
import { getPatientId, submitResolution } from './processPatient.js';

const signinForm = document.getElementById('signin-form');
const signoutButton = document.getElementById('btn-signout');
const submitResolutionForm = document.getElementById('form-submit-resolution');

if (signinForm) {
  signinForm.addEventListener('submit', event => {
    event.preventDefault();

    const email = signinForm.querySelector('#inputEmail').value;
    const password = signinForm.querySelector('#inputPassword').value;

    signin(email, password);
  });
}

if (signoutButton) {
  signoutButton.addEventListener('click', () => {
    signout();
  });
}

if (submitResolutionForm) {
  submitResolutionForm.addEventListener('submit', async event => {
    event.preventDefault();

    const patient = await getPatientId();
    const patientId = patient.data.data.patient.patientId;
    const resolution = document.getElementById('doctor-new-resolution').value;
    const timeToLive = document.getElementById('timeToLive').value;

    console.log(patientId);
    console.log(resolution);

    if (resolution) {
      submitResolution(patientId, resolution, timeToLive);
    }
  });
}
