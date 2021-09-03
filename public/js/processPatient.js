/* eslint-disable */

import axios from 'axios';

export const getPatientId = async () => {
  const config = {
    method: 'GET',
    url: 'http://127.0.0.1:8080/api/v1/queue',
    headers: {},
  };

  return await axios(config);
};

export const submitResolution = async (patientId, resolution, expiry) => {
  const config = {
    method: 'POST',
    url: 'http://127.0.0.1:8080/api/v1/resolutions',
    headers: {},
    data: {
      patientId,
      resolution,
      expiry,
    },
  };

  const res = await axios(config)
    .then(function (response) {
      if (response.data.status === 'success') {
        // console.log(response);
      }
    })
    .catch(function (error) {
      alert(error.response.data.message);
      // showAlert('error', error.response.data.message);
    });
};

export const dequeue = async () => {
  const config = {
    method: 'DELETE',
    url: 'http://127.0.0.1:8080/api/v1/queue',
    headers: {},
  };

  const res = await axios(config)
    .then(function (response) {
      // if (response.data.statusCode === 404) {
      //   alert('test');
      // }
    })
    .catch(function (error) {
      alert(error.response.data.message);
      // showAlert('error', error.response.data.message);
    });

  return res;
};
