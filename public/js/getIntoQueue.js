/* eslint-disable */

import axios from 'axios';

const getPersonalPatientId = async () => {
  const config = {
    method: 'GET',
    url: 'http://127.0.0.1:8080/api/v1/users/account',
  };

  const res = await axios(config).catch(function (error) {
    alert(error.response.data.message);
    // showAlert('error', error.response.data.message);
    return undefined;
  });

  if (res.data.status === 'success') {
    const patientId = res.data.data.data.patientId;
    return patientId;
  }
};

const getIntoQueue = async () => {
  const patientId = await getPersonalPatientId();

  const config = {
    method: 'POST',
    url: 'http://127.0.0.1:8080/api/v1/queue',
    data: {
      patientId,
    },
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

export { getIntoQueue };
