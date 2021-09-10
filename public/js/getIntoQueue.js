/* eslint-disable */

import axios from 'axios';

const getIntoQueue = async () => {
  const config = {
    method: 'POST',
    url: 'http://127.0.0.1:8080/api/v1/queue',
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
