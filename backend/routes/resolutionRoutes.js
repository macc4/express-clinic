import express from 'express';
import ajvValidator from '../middlewares/ajvValidator.js';
import resolutionController from '../controllers/resolutionController.js';
import resolutionSchema from '../schemas/resolutionSchema.js';

const router = express.Router();

router
  .route('/')
  .post(ajvValidator('body', resolutionSchema), resolutionController.createResolution)
  .get(resolutionController.getResolutions);

router.route('/:name').delete(resolutionController.deleteResolution);

/** @swagger
 * components:
 *   schemas:
 *     resolution-post:
 *       type: object
 *       required:
 *         - name
 *         - resolution
 *         - timeToLive
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the patient
 *         resolution:
 *           type: string
 *           description: Resolution, submitted by the doctor
 *         timeToLive:
 *           type: integer
 *           description: TTL option in minutes, should be at least 1
 *       example:
 *         name: Edward Cullen
 *         resolution: He is a vampire
 *         timeToLive: 20
 *     resolution:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *           description: Key of the patient (name in kebab-case)
 *         name:
 *           type: string
 *           description: The name of the patient
 *         resolution:
 *           type: string
 *           description: Resolution, submitted by the doctor
 *         expiry:
 *           type: integer
 *           description: Expiry time in Unix time (-1 if no expiry)
 *       example:
 *         key: edward-cullen
 *         name: Edward Cullen
 *         resolution: He is a vampire
 *         expiry: -1
 */

/**
 * @swagger
 * tags:
 *   name: Resolution
 *   description: API to manage the resolution database
 */

/**
 * @swagger
 * /api/v1/resolutions:
 *   post:
 *     summary: Add a new patient/resolution pair to the database
 *     tags: [Resolution]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resolution-post'
 *     responses:
 *       200:
 *         description: Patient/resolution pair was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/resolution'
 *       404:
 *         description: Invalid input data or duplicate patient error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/resolutions/?patient=:
 *   get:
 *     summary: Get the patient/resolution info by name
 *     tags: [Resolution]
 *     parameters:
 *       - in: query
 *         name: patient
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient's name
 *     responses:
 *       200:
 *         description: Patient/Resolution data by name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/resolution'
 *       404:
 *         description: The patient was not found
 */

/**
 * @swagger
 * /api/v1/resolutions/{key}:
 *   delete:
 *     summary: Remove the patient/resolution info by key (name in kebab-case)
 *     tags: [Resolution]
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient's name (must be in kebab-case)
 *
 *     responses:
 *       204:
 *         description: The patient was deleted
 *       404:
 *         description: The patient was not found
 */

export default router;
