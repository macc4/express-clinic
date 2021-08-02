export default class QueueModel {
  constructor() {
    this.patients = [];
    this.currentPatientId = undefined;
    this.currentPatient = undefined;
    this.currentPatientName = undefined;
    this.searchedResolution = '';
  }

  addPatient(patientName) {
    console.log(this.patients);

    const duplicatePatient = this.patients.some((patient) => patient.name === patientName.toUpperCase());

    if (!duplicatePatient) {
      const patient = {
        id: this.patients.length > 0 ? this.patients[this.patients.length - 1].id + 1 : 1,
        name: patientName.toUpperCase(),
        resolution: undefined,
      };

      this.patients.push(patient);
    } else {
      return alert('Database already contains this patient!');
    }
  }

  selectTheNextPatient() {
    const currentPatientIndex = this.patients.findIndex((patient) => patient.resolution === undefined);
    if (currentPatientIndex === -1) {
      return alert('There are no patients left!');
    }

    if (this.currentPatientId == this.patients[currentPatientIndex].id) {
      return alert('Add the resolution before moving to the next patient!');
    }

    this.currentPatientId = this.patients[currentPatientIndex].id;

    this.currentPatient = this.patients.filter((patient) => patient.id == this.currentPatientId);
    this.currentPatientName = this.currentPatient[0].name;

    console.log(this.patients);
  }

  addResolution(resolution) {
    if (this.currentPatientId === undefined || this.currentPatientId === -1) {
      return alert('Please, select the patient first!');
    }

    this.patients = this.patients.map((patient) =>
      patient.id === this.currentPatientId ? { id: patient.id, name: patient.name, resolution: resolution } : patient
    );

    console.log(this.patients);
  }

  searchResolution(patientName) {
    const currentPatientSearchIndex = this.patients.findIndex((patient) => patient.name === patientName.toUpperCase());
    if (currentPatientSearchIndex === -1) {
      return alert('There is no patient with such name!');
    }

    this.searchedResolution = this.patients[currentPatientSearchIndex].resolution;
  }

  deletePatient(patientName) {
    const currentPatientSearchIndex = this.patients.findIndex((patient) => patient.name === patientName.toUpperCase());
    if (currentPatientSearchIndex === -1) {
      return alert('There is no patient with such name!');
    }

    this.patients = this.patients.filter((patient) => patient.name !== patientName.toUpperCase());
  }
}
