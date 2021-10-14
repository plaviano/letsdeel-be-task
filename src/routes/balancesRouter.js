const express = require('express');
const router = express.Router();

const { BalancesController } = require('../controllers/BalancesController');
const balancesController = new BalancesController();

const { getProfile } = require('../middleware/getProfile')

/**
 * @swagger
 * tags:
 * - name: "balances"
 *   description: "Everything about Balances"
 *   externalDocs:
 *     description: "Find out more"
 *     url: "http://swagger.io"
 */

/**
 * @swagger
 * /balances/deposit/{userId}:
 *   post:
 *     tags:
 *     - "balances"
 *     summary: Deposits money into the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 *     description: Deposits money into the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "userId"
 *       in: "path"
 *       description: "Ii of the user to deposit money to."
 *       required: true
 *       type: "integer"
 *       minimum: 1.0
 *       format: "int64"
 *     requestBody:
 *       description: Object that represents the amount of money to be deposited into the authenticated user balance.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deposit'
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
router.post('/deposit/:userId', getProfile, balancesController.depositMoneyForUser);

module.exports = router;