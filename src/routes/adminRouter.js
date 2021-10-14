const express = require('express');
const router = express.Router();

const { AdminController } = require('../controllers/AdminController');
const adminController = new AdminController();

const { getProfile } = require('../middleware/getProfile')

/**
 * @swagger
 * tags:
 * - name: "admin"
 *   description: "Everything about Admin"
 *   externalDocs:
 *     description: "Find out more"
 *     url: "http://swagger.io"
 */

/**
 * @swagger
 * /admin/best-profession:
 *   get:
 *     tags:
 *     - "admin"
 *     summary: Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 *     description: Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 *     parameters:
 *     - in: query
 *       name: start
 *       schema:
 *         type: string
 *       description: "The worked start date. Format: yyyy-mm-ddTHH:MM:SS.sss E.g. 2021-10-14T20:27:42.259Z"
 *     - in: query
 *       name: end
 *       schema:
 *         type: string
 *       description: "The worked end date filter. Format: yyyy-mm-ddTHH:MM:SS.sss E.g. 2021-10-14T20:27:42.259Z"
 *     responses:
 *       '200':
 *         description: OK
*/
router.get('/best-profession', adminController.bestProfession);

/**
 * @swagger
 * /admin/best-clients:
 *   get:
 *     tags:
 *     - "admin"
 *     summary: Returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
 *     description: Returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
 *     parameters:
 *     - in: query
 *       name: start
 *       schema:
 *         type: string
 *       description: "The worked start date. Format: yyyy-mm-ddTHH:MM:SS.sss E.g. 2021-10-14T20:27:42.259Z"
 *     - in: query
 *       name: end
 *       schema:
 *         type: string
 *       description: "The worked end date filter. Format: yyyy-mm-ddTHH:MM:SS.sss E.g. 2021-10-14T20:27:42.259Z"
 *     - in: query
 *       name: limit
 *       schema:
 *         type: integer
 *       description: The number of results to retrieve filter.
 *     responses:
 *       '200':
 *         description: OK
 *       '422':
 *         description: Business error
*/
router.get('/best-clients', adminController.bestClients)

module.exports = router;