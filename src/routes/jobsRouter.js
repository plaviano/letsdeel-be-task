const express = require('express');
const router = express.Router();

const { JobsController } = require('../controllers/JobsController');
const jobsController = new JobsController();

const { getProfile } = require('../middleware/getProfile')

/**
 * @swagger
 * tags:
 * - name: "jobs"
 *   description: "Everything about Jobs"
 *   externalDocs:
 *     description: "Find out more"
 *     url: "http://swagger.io"
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     tags:
 *     - "jobs"
 *     summary: Get jobs for a user (either a client or contractor).
 *     description: Get jobs for a user (either a client or contractor).
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: Not authenticated
 *       '422':
 *         description: Business error
 *     security:
 *     - profile_id: []
*/
router.get('/', getProfile, jobsController.getAllJobs);

/**
 * @swagger
 * /jobs/unpaid:
 *   get:
 *     tags:
 *     - "jobs"
 *     summary: Get all unpaid jobs for a user (either a client or contractor), for active contracts only.
 *     description: Get all unpaid jobs for a user (either a client or contractor), for active contracts only.
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: Not authenticated
 *       '422':
 *         description: Business error
 *     security:
 *     - profile_id: []
*/
router.get('/unpaid', getProfile, jobsController.getAllUnpaidJobsForUser);

/**
 * @swagger
 * /jobs/{job_id}/pay:
 *   post:
 *     tags:
 *     - "jobs"
 *     summary: Pay for a job.
 *     description: Pay for a job. A client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
 *     parameters:
 *     - name: "job_id"
 *       in: "path"
 *       description: "ID of the job to be paid by the authenticated user."
 *       required: true
 *       type: "integer"
 *       minimum: 1.0
 *       format: "int64"
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: Not authenticated
 *       '422':
 *         description: Business error
 *     security:
 *     - profile_id: []
*/
router.post('/:job_id/pay', getProfile, jobsController.payJob);

module.exports = router;