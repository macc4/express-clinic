import express from 'express';
import queueController from '../controllers/queueController.js';

const router = express.Router();

router.route('/').post(queueController.enqueuePatient);

router
  .route('/:id')
  .get(queueController.getPatient)
  .delete(queueController.dequeuePatient);

/** @swagger
 * components:
 *   schemas:
 *     patient-post:
 *       type: object
 *       required:
 *         - name
 *         - timeToLive
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the patient, capitalized
 *         timeToLive:
 *           type: integer
 *           description: TTL value in minutes or -1 if none required
 *       example:
 *         name: Edward Cullen
 *         timeToLive: -1
 *     patient:
 *       type: object
 *       required:
 *         - name
 *         - expiry
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the patient, capitalized
 *         expiry:
 *           type: integer
 *           description: Expiry time in ms or -1 if none required
 *       example:
 *         name: Edward Cullen
 *         expiry: -1
 */

/**
 * @swagger
 * tags:
 *   name: Queue
 *   description: API to manage the queue
 */

/**
 * @swagger
 * /api/v1/queue:
 *   post:
 *     summary: Add a new patient to the queue
 *     tags: [Queue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/patient-post'
 *     responses:
 *       200:
 *         description: Patient was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/patient'
 *       404:
 *         description: Invalid input data or duplicate patient error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/queue/{id}:
 *   get:
 *     summary: Get the patient by queue number starting from 1
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient's queue number
 *     responses:
 *       200:
 *         description: Patient data by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/patient'
 *       404:
 *         description: The patient was not found
 */

/**
 * @swagger
 * /api/v1/queue/{id}:
 *   delete:
 *     summary: Remove the patient by queue number starting from 1
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The queue number
 *
 *     responses:
 *       204:
 *         description: The patient was deleted
 *       404:
 *         description: The patient was not found
 */

export default router;
