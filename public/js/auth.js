/* eslint-disable */

// import { showAlert } from './alerts.js';
import axios from 'axios';

const signin = async (email, password) => {
  const config = {
    method: 'POST',
    url: 'http://127.0.0.1:8080/api/v1/users/signin',
    data: {
      email,
      password,
    },
  };

  const res = await axios(config)
    .then(function (response) {
      if (response.data.status === 'success') {
        console.log(response);
        // location.assign('/');
      }
    })
    .catch(function (error) {
      alert(error.response.data.message);
      // showAlert('error', error.response.data.message);
    });
};

const signout = async () => {
  const config = {
    method: 'GET',
    url: 'http://127.0.0.1:8080/api/v1/users/signout',
  };

  const res = await axios(config)
    .then(function (response) {
      if (response.data.status === 'success') {
        location.assign('/');
      }
    })
    .catch(function (error) {
      alert(error.response.data.message);
      // showAlert('error', error.response.data.message);
    });
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

  const res = await axios(config)
    .then(function (response) {
      if (response.data.status === 'success') {
        location.assign('/');
      }
    })
    .catch(function (error) {
      alert(error.response.data.message);
      // showAlert('error', error.response.data.message);
    });
};

export { signin, signout, signup };
