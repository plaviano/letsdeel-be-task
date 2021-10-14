const { Op } = require('sequelize');
const { BaseController } = require('./BaseController');
const {sequelize, Profile} = require('../model');
const {models} = sequelize;
const {Contract, Job} = models;

class BalancesController extends BaseController {
  constructor() {
    super();
    this.depositMoneyForUser = this.depositMoneyForUser.bind(this);
  }

  /**
   * Deposits money for a user
   * @returns 
   */
  async depositMoneyForUser(req, res) {
    const {profile} = req;
    const { userId } = req.params;
    const { amount } = req.body;

    if(!userId)
      return this.unprocessableEntity(res, 'You must specify the userId param.')
    if(amount === null || typeof amount === 'undefined')
      return this.unprocessableEntity(res, 'No amount specified.')
    if(amount === 0)
      return this.unprocessableEntity(res, 'Amount must be greater than 0.')
    
    if(!profile)
      return this.unauthorized(res);

    const contractsBelongingToUser = await Contract.findAll({
      where: {
        ...Contract.queryUserBelongingContracts(userId),
        ...Contract.queryActiveContracts()
      }
    });

    const unpaidJobs = await Job.findAll({
      where: {
        [Op.or]: [{
          paid: {
            [Op.eq]: null
          }
        },{
          paid: {
            [Op.ne]: true
          }
        }],
        ContractId: {
          [Op.in]: contractsBelongingToUser.map((contract) => contract.id)
        }
      }
    });

    const totalUnpaidPrice = unpaidJobs.reduce((sum, job) => sum + job.price, 0);
    const upperLimit = 0.25 * totalUnpaidPrice;

    if(amount > upperLimit)
      return this.unprocessableEntity(res, 'You can only deposit at most 25% of the unpaid jobs prices sum at the deposit moment.')
    
    const user = await Profile.findOne({
      where: {
        id: userId
      }
    });

    if(!user)
      return this.notFound(res, 'User not found');
    
    const newBalance = user.balance + amount;

    await Profile.update({
      balance: newBalance
    }, {
      where: {
        id: user.id
      }
    })
    
    return this.ok(res, {
      oldBalance: user.balance,
      newBalance: newBalance
    });
  }
}

module.exports = { BalancesController };
