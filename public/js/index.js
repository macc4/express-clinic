/* eslint-disable */

import '@babel/polyfill';
import { signin, doctorSignin, signup, signout } from './auth.js';
import { getPatientId, submitResolution, dequeue } from './processPatient.js';
import { getIntoQueue } from './getIntoQueue.js';
import searchResolutionsByName from './searchResolutionsByName.js';

const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const doctorSigninForm = document.getElementById('doctorSigninForm');
const signoutButton = document.getElementById('btn-signout');
const submitResolutionForm = document.getElementById('form-submit-resolution');
const nextPatientButton = document.getElementById('btn-next-patient');
const getIntoQueueButton = document.getElementById('btn-get-into-queue');
const searchResolutionsByNameForm = document.getElementById(
  'form-search-resolutions-by-name',
);
const selectedDoctor = document.getElementById('doctorSelect');

if (signinForm) {
  signinForm.addEventListener('submit', event => {
    event.preventDefault();

    const email = signinForm.querySelector('#inputEmail').value;
    const password = signinForm.querySelector('#inputPassword').value;

    signin(email, password);
  });
}

if (doctorSigninForm) {
  doctorSigninForm.addEventListener('submit', async event => {
    event.preventDefault();

    const email = doctorSigninForm.querySelector('#inputEmail').value;
    const password = doctorSigninForm.querySelector('#inputPassword').value;

    await doctorSignin(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', event => {
    event.preventDefault();

    // add birthday, gender
    const name = signupForm.querySelector('#inputName').value;
    const email = signupForm.querySelector('#inputEmail').value;
    const password = signupForm.querySelector('#inputPassword').value;
    const passwordConfirm = signupForm.querySelector(
      '#inputPasswordConfirm',
    ).value;
    const gender = signupForm.querySelector('#inputGender').value;
    const birthday = signupForm.querySelector('#inputBirthday').value;

    signup(name, email, password, passwordConfirm, gender, birthday);
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
  getIntoQueueButton.addEventListener('click', async () => {
    const selectedOption = selectedDoctor.options.selectedIndex;
    const doctorId = selectedDoctor.options[selectedOption].value;
    await getIntoQueue(doctorId);
  });
}

if (searchResolutionsByNameForm) {
  searchResolutionsByNameForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = searchResolutionsByNameForm.querySelector('#name').value;

    searchResolutionsByName(name);
  });
}
