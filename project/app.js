document.addEventListener('DOMContentLoaded', () => {
  let patients = [];

  const patientForm = document.getElementById('patient-form'),
    doctorResolutionForm = document.getElementById('doctor-resolution-form'),
    currentPatient = document.getElementById('patient-current'),
    doctorPatient = document.getElementById('doctor-current');

  const showCurrentPatient = function (database, parent) {
    const currentPatientName = database[0][0];
    parent.innerHTML = `${currentPatientName}`;
  };

  const showResolutionByPatientName = function () {};

  const addPatientToDatabase = function (database, patient) {
    database.push([patient, '']);
    console.log(database);
  };

  const addResolutionToPatient = function (database, resolution) {
    const currentPatientValue = database.findIndex(
      (element) => element[0] === doctorPatient.innerHTML
    );
    database[currentPatientValue][1] = resolution;
  };

  const moveToTheNextPatient = function () {};
  const deletePatientFromDatabase = function () {};

  patientForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const patientInput = document.getElementById('patient-form-input');
    const patientName = patientInput.value;

    addPatientToDatabase(patients, patientName);

    document.getElementById('patient-form').reset();

    showCurrentPatient(patients, currentPatient);
    showCurrentPatient(patients, doctorPatient);
  });

  doctorResolutionForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const resolutionInput = document.getElementById('resolution-input');
    const resolutionText = resolutionInput.value;
  });
});
