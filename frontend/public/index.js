const queueURL = 'http://localhost:8080/api/v1/queue';
const mainURL = 'http://localhost:8080/api/v1/patients';
let searchedResolutionKey;

// #region
// current patient
const currentPatientPatient = document.getElementById(
  'current-patient-patient'
);
const currentPatientDoctor = document.getElementById('current-patient-doctor');

// patient forms/buttons
const patientAddForm = document.getElementById('form-add-patient');
const patientSearchForm = document.getElementById('patient-search-resolutions');
const patientResolutionsList = document.getElementById(
  'patient-resolutions-list'
);

// patient inputs
const newPatient = document.getElementById('input-text');
const patientSearchInput = document.getElementById('patient-search');

// doctor forms/buttons
const doctorAddForm = document.getElementById('form-submit-resolution');
const doctorSearchForm = document.getElementById('doctor-search-resolutions');
const buttonDelete = document.getElementById('btn-delete');
const doctorResolutionsList = document.getElementById(
  'doctor-resolutions-list'
);

// doctor inputs
const doctorNewResolutionInput = document.getElementById(
  'doctor-new-resolution'
);
const timeToLiveInput = document.getElementById('timeToLive');
const doctorSearchInput = document.getElementById('doctor-search');
//#endregion

// #region classes
class Resolution {
  constructor(text, date, parent) {
    this.parent = parent;
    this.text = text;
    this.date = date;
    this.outputDate = this.convertDate();
    this.render();
  }

  convertDate() {
    console.log(this.date);
    if (typeof this.date === 'string') {
      const date = this.date.replace('T', ' ').replace('.000Z', '');
      return date;
    } else {
      const dateObj = new Date(this.date);
      const dateStr = dateObj.toLocaleDateString('en-GB');
      const timeStr = dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const outputDate = timeStr + ' ' + dateStr;
      return outputDate;
    }
  }

  render() {
    const element = document.createElement('div');
    element.className = 'list-group-item py-3';
    element.innerHTML = `
    <p class="mb-1">
      ${this.text}
    </p>
    <small>${this.outputDate}</small>
    `;
    this.parent.append(element);
  }
}
// #endregion

// #region logic

const searchPatientId = async patientName => {
  const response = await axios
    .get(`${mainURL}/?name=${patientName}`)
    .catch(function (error) {
      alert(error.response.data.message);
    });

  const patientId = response.data.data.patients[0].id;

  return patientId;
};

// #region patient/doctor update current patient
const showCurrentPatient = async parent => {
  const queueResponse = await axios.get(`${queueURL}`).catch(function (error) {
    parent.innerHTML = 'empty';
  });

  const patientId = queueResponse.data.data.patient.patientId;

  const response = await axios
    .get(`${mainURL}/${patientId}`)
    .catch(function (error) {
      parent.innerHTML = 'empty';
    });

  const patientName = response.data.data.patient.name;

  parent.innerHTML = patientName;
};

window.addEventListener('DOMContentLoaded', () => {
  if (currentPatientPatient) {
    showCurrentPatient(currentPatientPatient);
    setInterval(() => showCurrentPatient(currentPatientPatient), 5000);
  }
  if (currentPatientDoctor) {
    showCurrentPatient(currentPatientDoctor);
    setInterval(() => showCurrentPatient(currentPatientDoctor), 5000);
  }
});
// #endregion

// #region enqueue
const patientPost = async patientName => {
  const response = await axios
    .post(`${mainURL}`, {
      name: patientName,
    })
    .catch(function (error) {
      console.log(error.response.data);
      alert(error.response.data.message);
    });

  return response.data.data.patient.id;
};

const patientEnqueue = async patientId => {
  await axios
    .post(`${queueURL}`, {
      patientId: patientId,
    })
    .catch(function (error) {
      alert(error.response.data.message);
    });
};

if (patientAddForm) {
  patientAddForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (newPatient.value !== '') {
      const patient = await patientPost(newPatient.value);
      console.log(patient);
      await patientEnqueue(patient);
      newPatient.value = '';
    }
  });
}
//#endregion

// #region patient/doctor search resolutions

const searchResolutionsByPatientId = async patientId => {
  const response = await axios
    .get(`${mainURL}/${patientId}/resolutions`)
    .catch(function (error) {
      alert(error.response.data.message);
    });

  const resolutions = response.data.data.resolutions;

  return resolutions;
};

const showResolutions = async (resolutions, parent) => {
  parent.innerHTML = '';
  resolutions.forEach(
    resolution =>
      new Resolution(resolution.resolution, resolution.createdAt, parent)
  );
};

if (patientSearchForm) {
  patientSearchForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (patientSearchInput.value !== '') {
      const patientId = await searchPatientId(patientSearchInput.value);
      const resolutions = await searchResolutionsByPatientId(patientId);
      showResolutions(resolutions, patientResolutionsList);

      patientSearchInput.value = '';
    }
  });
}

if (doctorSearchForm) {
  doctorSearchForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (doctorSearchInput.value !== '') {
      const patientId = await searchPatientId(doctorSearchInput.value);
      const resolutions = await searchResolutionsByPatientId(patientId);
      showResolutions(resolutions, doctorResolutionsList);
      doctorSearchInput.value = '';
    }
  });
}
// #endregion

// #region doctor process patient
const doctorProcessPatient = async (resolution, timeToLive) => {
  const response = await axios.get(`${queueURL}`).catch(function (error) {
    alert(error.response.data.message);
  });

  const patientId = response.data.data.patient.patientId;

  let request;

  if (timeToLive !== '') {
    request = {
      resolution: resolution,
      timeToLive: +timeToLive,
    };
  } else {
    request = {
      resolution: resolution,
    };
  }

  await axios
    .post(`${mainURL}/${patientId}/resolutions`, request)
    .catch(function (error) {
      alert(error.response.data.message);
    });

  await axios.delete(`${queueURL}`).catch(function (error) {
    alert(error.response.data.message);
  });
  showCurrentPatient(currentPatientDoctor);
};

if (doctorAddForm) {
  doctorAddForm.addEventListener('submit', event => {
    event.preventDefault();

    if (doctorNewResolutionInput.value !== '') {
      doctorProcessPatient(
        doctorNewResolutionInput.value,
        timeToLiveInput.value
      );
      doctorNewResolutionInput.value = '';
      timeToLiveInput.value = '';
    }
  });
}
// #endregion

// #region doctor delete resolution
const deleteResolutions = async patientId => {
  const response = await axios
    .delete(`${mainURL}/${patientId}/resolutions`)
    .catch(function (error) {
      alert(error.response.data.message);
    });
  console.log(response);
};

if (buttonDelete) {
  buttonDelete.addEventListener('click', async () => {
    if (doctorSearchInput.value !== '') {
      const patientId = await searchPatientId(doctorSearchInput.value);
      await deleteResolutions(patientId);
      doctorResolutionsList.innerHTML = '';
      doctorSearchInput.value = '';
    }
  });
}
// #endregion

// #endregion
