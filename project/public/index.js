import QueueController from './controllers/queueController.js';
import QueueModel from './models/queueModel.js';
import QueueView from './views/queueView.js';

document.addEventListener('DOMContentLoaded', () => {
  const queue = new QueueController(new QueueModel(), new QueueView());
});
