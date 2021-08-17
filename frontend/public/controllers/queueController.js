export default class QueueController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindEnqueue(this.handleEnqueue);
    this.view.bindShowNextPatient(this.handleShowNextPatient);
    this.handleShowNextPatient();

    // update current patient on the patient's side
    setInterval(() => this.handleShowNextPatient(), 10000); // ehhhh
  }

  // handlers are questionable

  handleEnqueue = (name, timeToLive) => {
    try {
      this.model.enqueue(name, timeToLive);
    } catch (error) {
      this.view.showError(error);
    }
  };

  handleShowNextPatient = async () => {
    try {
      const patient = await this.model.peek(1);
      this.view.showCurrentPatient(patient.name);
    } catch (error) {
      const patient = '&ltempty&gt';

      this.view.showCurrentPatient(patient);
    }
  };
}
