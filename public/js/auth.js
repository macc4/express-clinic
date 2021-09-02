/* eslint-disable */

// import { showAlert } from './alerts.js';
import axios from 'axios';

export const signin = async (email, password) => {
  const config = {
    method: 'POST',
    url: 'http://127.0.0.1:8080/api/v1/users/signin',
    headers: {},
    data: {
      email,
      password,
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

export const signout = async () => {
  const config = {
    method: 'GET',
    url: 'http://127.0.0.1:8080/api/v1/users/signout',
  };

  const res = await axios(config)
    .then(function (response) {
      if (response.data.status === 'success') {
        location.reload(true);
      }
    })
    .catch(function (error) {
      alert(error.response.data.message);
      // showAlert('error', error.response.data.message);
    });
};
