const express = require('express');
const router = express.Router();

const { ContractsController } = require('../controllers/ContractsController');
const contractsController = new ContractsController();

const { getProfile } = require('../middleware/getProfile')

/**
 * @swagger
 * tags:
 * - name: "contracts"
 *   description: "Everything about Contracts"
 *   externalDocs:
 *     description: "Find out more"
 *     url: "http://swagger.io"
 */

/**
 * @swagger
 * /contracts:
 *   get:
 *     tags:
 *     - "contracts"
 *     summary: Returns a list of non-terminated contracts belonging to a user (client or contractor).
 *     description: Returns a list of non-terminated contracts belonging to a user (client or contractor).
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
router.get('/', getProfile, contractsController.getContractsForProfile);

/**
 * @swagger
 * /contracts/{id}:
 *   get:
 *     tags:
 *     - "contracts"
 *     summary: Retrieve a contract by id only if it is owned by the authenticated profile.
 *     description: Retrieve a contract by id only if it is owned by the authenticated profile.
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       description: "ID of the contract belong to the authenticated user."
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
router.get('/:id', getProfile, contractsController.getContractForProfile);

module.exports = router;