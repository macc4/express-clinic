import QueueController from './controllers/patientQueueController.js';
import QueueModel from './models/patientQueueModel.js';
import QueueView from './views/patientQueueView.js';

document.addEventListener('DOMContentLoaded', () => {
  const queue = new QueueController(new QueueModel(), new QueueView());
});
