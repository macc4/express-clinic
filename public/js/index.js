/* eslint-disable */

import '@babel/polyfill';
import { signin, signup, signout } from './auth.js';
import { getPatientId, submitResolution, dequeue } from './processPatient.js';
import { getIntoQueue } from './getIntoQueue.js';

const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const signoutButton = document.getElementById('btn-signout');
const submitResolutionForm = document.getElementById('form-submit-resolution');
const nextPatientButton = document.getElementById('btn-next-patient');
const getIntoQueueButton = document.getElementById('btn-get-into-queue');

if (signinForm) {
  signinForm.addEventListener('submit', event => {
    event.preventDefault();

    const email = signinForm.querySelector('#inputEmail').value;
    const password = signinForm.querySelector('#inputPassword').value;

    signin(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = signupForm.querySelector('#inputName').value;
    const email = signupForm.querySelector('#inputEmail').value;
    const password = signupForm.querySelector('#inputPassword').value;
    const passwordConfirm = signupForm.querySelector(
      '#inputPasswordConfirm',
    ).value;

    signup(name, email, password, passwordConfirm);
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
    const expiry = document.getElementById('timeToLive').value;

    if (resolution) {
      submitResolution(patientId, resolution, expiry);
    }
  });
}

if (nextPatientButton) {
  nextPatientButton.addEventListener('click', () => {
    dequeue();
    location.reload(true);
  });
}

if (getIntoQueueButton) {
  getIntoQueueButton.addEventListener('click', () => {
    getIntoQueue();
  });
}
