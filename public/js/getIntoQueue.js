/* eslint-disable */

import axios from 'axios';

const getIntoQueue = async doctorId => {
  const config = {
    method: 'POST',
    url: `http://127.0.0.1:8080/api/v1/queue/${doctorId}`,
  };

  try {
    const response = await axios(config);
    if (response.data.status === 'success') {
      location.reload(true);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};

export { getIntoQueue };
