/* eslint-disable */

// import { showAlert } from './alerts.js';
import axios from 'axios';
import SELECTED_DOCTOR from './doctorInit';

const base = 'http://127.0.0.1:8080/api/v1/users';

const signin = async (email, password) => {
  const config = {
    method: 'POST',
    url: 'http://127.0.0.1:8080/api/v1/users/signin',
    data: {
      email,
      password,
    },
  };

  try {
    const response = await axios(config);
    if (response.data.status === 'success') {
      location.assign(`/doctor-${SELECTED_DOCTOR}`);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};

const doctorSignin = async (email, password) => {
  const config = {
    method: 'POST',
    url: `${base}/signin`,
    data: {
      email,
      password,
    },
  };

  try {
    const response = await axios(config);
    if (response.data.status === 'success') {
      location.assign('/doctor');
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};

const signout = async () => {
  const config = {
    method: 'GET',
    url: 'http://127.0.0.1:8080/api/v1/users/signout',
  };

  try {
    const response = await axios(config);
    if (response.data.status === 'success') {
      location.assign('/');
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};

const signup = async (
  name,
  email,
  password,
  passwordConfirm,
  gender,
  birthday,
) => {
  const config = {
    method: 'POST',
    url: 'http://127.0.0.1:8080/api/v1/users/signup',
    headers: {},
    data: {
      name,
      email,
      password,
      passwordConfirm,
      gender,
      birthday,
    },
  };

  try {
    const response = await axios(config);
    if (response.data.status === 'success') {
      location.assign(`/doctor-${SELECTED_DOCTOR}`);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};

export { signin, doctorSignin, signout, signup };
