import QueueController from './controllers/queueController.js';
import QueueModel from './models/queueModel.js';
import QueueView from './views/queueView.js';

import ResolutionController from './controllers/resolutionController.js';
import ResolutionModel from './models/resolutionModel.js';
import ResolutionView from './views/resolutionView.js';

const queueModel = new QueueModel();
const resolutionModel = new ResolutionModel(queueModel);

const queue = new QueueController(queueModel, new QueueView());
const resolutions = new ResolutionController(resolutionModel, new ResolutionView());
