document.addEventListener('DOMContentLoaded', () => {
  let patients = [];

  const newPatientForm = document.getElementById('patient-form'),
    doctorResolutionForm = document.getElementById('doctor-resolution-form'),
    currentPatientTag = document.getElementById('patient-current'),
    doctorPatientTag = document.getElementById('doctor-current'),
    nextPatientButton = document.getElementById('doctor-next-patient'),
    patientSearchResolutionName = document.getElementById(
      'patient-search-form'
    ),
    patientResolutionSearchButton = document.getElementById(
      'patient-resolution-button'
    ),
    patientResolutionField = document.getElementById(
      'patient-resolution-field'
    ),
    doctorSearchResolutionName = document.getElementById('doctor-search-form'),
    doctorResolutionField = document.getElementById('doctor-resolution-field'),
    doctorResolutionSearchButton = document.getElementById(
      'doctor-resolution-button-search'
    ),
    doctorResolutionDeleteButton = document.getElementById(
      'doctor-resolution-button-delete'
    );

  let currentPatientIndex = undefined;

  const showCurrentPatient = function (patient, parentObject) {
    parentObject.innerHTML = `${patient}`;
  };

  const selectTheNextPatient = function (database) {
    // find the first patient without the resolution
    currentPatientIndex = database.findIndex((element) => element[1] === '');
    if (currentPatientIndex === -1) {
      return alert('There are no patients left!');
    }
    // show the name on the webpage
    showCurrentPatient(database[currentPatientIndex][0], currentPatientTag);
    showCurrentPatient(database[currentPatientIndex][0], doctorPatientTag);
    console.log(database);
  };

  const addPatientToDatabase = function (database, patient) {
    let duplicatePatient = database.some((el) => el[0] === patient);

    if (!duplicatePatient) {
      database.push([patient, '']);
    } else {
      alert('Database already contains this patient!');
    }
    console.log(database);
  };

  const deletePatientFromDatabase = function (database, patient) {
    const currentPatientSearchIndex = database.findIndex(
      (element) => element[0] === patient
    );
    if (currentPatientSearchIndex === -1) {
      return alert('There is no patient with such name!');
    }
    database.splice(currentPatientSearchIndex, 1);
    alert(`The ${patient} patient has been deleted!`);
    console.log(database);
  };

  const addResolutionToPatient = function (database, resolution) {
    if (currentPatientIndex === -1 || currentPatientIndex === undefined) {
      return alert('Please, select the patient first!');
    }
    // check if resolution is empty
    if (database[currentPatientIndex][1] === '') {
      database[currentPatientIndex][1] = resolution;
    } else {
      database[currentPatientIndex][1] += ` \n ` + resolution;
    }
    console.log(database);
  };

  const showResolutionByPatientName = function (
    database,
    patient,
    parentObject
  ) {
    const currentPatientSearchIndex = database.findIndex(
      (element) => element[0] === patient
    );
    if (currentPatientSearchIndex === -1) {
      return alert('There is no patient with such name');
    }
    parentObject.innerHTML = database[currentPatientSearchIndex][1];
    console.log(database);
  };

  // logic of the page

  newPatientForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const patientInput = document.getElementById('patient-form-input');
    const patientName = patientInput.value;

    addPatientToDatabase(patients, patientName);

    newPatientForm.reset();
  });

  patientResolutionSearchButton.addEventListener('click', () => {
    const patientName = patientSearchResolutionName.value;
    showResolutionByPatientName(patients, patientName, patientResolutionField);
    patientResolutionField.reset();
  });

  nextPatientButton.addEventListener('click', () => {
    selectTheNextPatient(patients);
  });

  doctorResolutionForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const resolutionInput = document.getElementById('resolution-input');
    const resolutionText = resolutionInput.value;

    addResolutionToPatient(patients, resolutionText);

    doctorResolutionForm.reset();
  });

  doctorResolutionSearchButton.addEventListener('click', () => {
    const patientName = doctorSearchResolutionName.value;
    showResolutionByPatientName(patients, patientName, doctorResolutionField);

    doctorSearchResolutionName.reset();
  });

  doctorResolutionDeleteButton.addEventListener('click', () => {
    const patientName = doctorSearchResolutionName.value;
    deletePatientFromDatabase(patients, patientName);

    doctorSearchResolutionName.reset();
  });
});
