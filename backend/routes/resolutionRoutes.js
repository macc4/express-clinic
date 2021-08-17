import express from 'express';
import resolutionController from '../controllers/resolutionController.js';

const router = express.Router();

router.route('/').post(resolutionController.createPatient);

router
  .route('/:name')
  .get(resolutionController.getPatient)
  .delete(resolutionController.deletePatient);

/** @swagger
 * components:
 *   schemas:
 *     resolution:
 *       type: object
 *       required:
 *         - name
 *         - resolution
 *         - expiry
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the patient
 *         resolution:
 *           type: string
 *           description: Resolution submitted by the doctor
 *         expiry:
 *           type: integer
 *           description: Expiry time in ms or -1 if none required
 *       example:
 *         name: edward-cullen
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
 *     summary: Add a new patient/resolution pair to the database (name can be in regular case)
 *     tags: [Resolution]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resolution'
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
 * /api/v1/resolutions/{name}:
 *   get:
 *     summary: Get the patient/resolution info by name (must be in kebab-case)
 *     tags: [Resolution]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient's name (must be in kebab-case)
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
 * /api/v1/resolutions/{name}:
 *   delete:
 *     summary: Remove the patient/resolution info by name (must be in kebab-case)
 *     tags: [Resolution]
 *     parameters:
 *       - in: path
 *         name: name
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
