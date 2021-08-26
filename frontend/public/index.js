const queueURL = 'http://localhost:8080/api/v1/queue';
const resolutionsURL = 'http://localhost:8080/api/v1/resolutions';
let searchedResolutionKey;

// #region
// current patient
const currentPatientPatient = document.getElementById('current-patient-patient');
const currentPatientDoctor = document.getElementById('current-patient-doctor');

// patient forms/buttons
const patientAddForm = document.getElementById('form-add-patient');
const patientSearchForm = document.getElementById('patient-search-resolutions');
const patientResolutionsList = document.getElementById('patient-resolutions-list');

// patient inputs
const newPatient = document.getElementById('input-text');
const patientSearchInput = document.getElementById('patient-search');

// doctor forms/buttons
const doctorAddForm = document.getElementById('form-submit-resolution');
const doctorSearchForm = document.getElementById('doctor-search-resolutions');
const buttonDelete = document.getElementById('btn-delete');
const doctorResolutionsList = document.getElementById('doctor-resolutions-list');

// doctor inputs
const doctorNewResolutionInput = document.getElementById('doctor-new-resolution');
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
    const dateObj = new Date(this.date);
    const dateStr = dateObj.toLocaleDateString('en-GB');
    const timeStr = dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const outputDate = timeStr + ' ' + dateStr;
    return outputDate;
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

// #region patient/doctor update current patient
const showCurrentPatient = async (parent) => {
  const response = await axios.get(`${queueURL}`).catch(function (error) {
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
const patientQueuePost = async (patientName) => {
  await axios
    .post(`${queueURL}`, {
      name: patientName,
    })
    .catch(function (error) {
      alert(error.response.data.message);
    });
};

if (patientAddForm) {
  patientAddForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (newPatient.value !== '') {
      patientQueuePost(newPatient.value);
      newPatient.value = '';
    }
  });
}
//#endregion

// #region patient/doctor search resolution
const resolutionSearchAndPrint = async (patientName, parent) => {
  const response = await axios
    .get(`${resolutionsURL}/?patient=${patientName}`)
    .catch(function (error) {
      alert(error.response.data.message);
    });

  const resolutions = response.data.data.patient.resolutions;

  searchedResolutionKey = response.data.data.patient.key;

  parent.innerHTML = '';
  resolutions.forEach(
    (resolution) => new Resolution(resolution.resolution, resolution.date, parent)
  );
};

if (patientSearchForm) {
  patientSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (patientSearchInput.value !== '') {
      resolutionSearchAndPrint(patientSearchInput.value, patientResolutionsList);
      patientSearchInput.value = '';
    }
  });
}

if (doctorSearchForm) {
  doctorSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (doctorSearchInput.value !== '') {
      resolutionSearchAndPrint(doctorSearchInput.value, doctorResolutionsList);
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
  const patientName = response.data.data.patient.name;

  let request;
  if (timeToLive !== '') {
    request = {
      name: patientName,
      resolution: resolution,
      timeToLive: +timeToLive,
    };
  } else {
    request = {
      name: patientName,
      resolution: resolution,
    };
  }

  await axios.post(`${resolutionsURL}`, request).catch(function (error) {
    alert(error.response.data.message);
  });

  await axios.delete(`${queueURL}`).catch(function (error) {
    alert(error.response.data.message);
  });
  showCurrentPatient(currentPatientDoctor);
};

if (doctorAddForm) {
  doctorAddForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (doctorNewResolutionInput.value !== '') {
      doctorProcessPatient(doctorNewResolutionInput.value, timeToLiveInput.value);
      doctorNewResolutionInput.value = '';
      timeToLiveInput.value = '';
    }
  });
}
// #endregion

// #region doctor delete resolution
const deleteResolution = async (key) => {
  const response = await axios.delete(`${resolutionsURL}/${key}`).catch(function (error) {
    alert(error.response.data.message);
  });
  console.log(response);
};

if (buttonDelete) {
  buttonDelete.addEventListener('click', () => {
    deleteResolution(searchedResolutionKey);
    doctorResolutionsList.innerHTML = '';
  });
}
// #endregion

// #endregion
