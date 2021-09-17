/* eslint-disable */

import axios from 'axios';

// most likely should be rewritten
export const getPatientId = async () => {
  const config = {
    method: 'GET',
    url: 'http://127.0.0.1:8080/api/v1/queue',
  };

  return await axios(config);
};

export const submitResolution = async (patientId, resolution, expiry) => {
  const config = {
    method: 'POST',
    url: 'http://127.0.0.1:8080/api/v1/resolutions',
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
  };

  try {
    const res = await axios(config);
    return res;
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const deleteResolution = async resolutionId => {
  const config = {
    method: 'DELETE',
    url: `http://127.0.0.1:8080/api/v1/resolutions/${resolutionId}`,
  };

  try {
    const res = await axios(config);
    return res;
  } catch (error) {
    alert(error.response.data.message);
  }
};
