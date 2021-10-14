const { Op } = require('sequelize');
const { BaseController } = require('./BaseController');
const {sequelize} = require('../model');
const {models} = sequelize;
const {Job, Contract, Profile} = models;

class JobsController extends BaseController {
  constructor() {
    super();

    this.getAllUnpaidJobsForUser = this.getAllUnpaidJobsForUser.bind(this);
    this.payJob = this.payJob.bind(this);
    this.getAllJobs = this.getAllJobs.bind(this);
  }

  /**
   * Get all jobs for the authenticated user.
   * @returns 
   */
  async getAllJobs(req, res) {
    const {profile} = req;

    if(!profile)
      return this.unauthorized(res);
    
    const contractsBelongingToUser = await Contract.findAll({
      where: {
        ...Contract.queryUserBelongingContracts(profile.id)
      }
    });
    
    const userJobs = await Job.findAll({
      where: {
        ContractId: {
          [Op.in]: contractsBelongingToUser.map((contract) => contract.id)
        }
      }
    });

    if(!userJobs)
      return this.notFound(res);
    
    return this.ok(res, userJobs);
  }

  /**
   * Get all unpaid jobs for a user (either a client or contractor), for active contracts only.
   * @returns 
   */
   async getAllUnpaidJobsForUser(req, res) {
    const {profile} = req;
    
    if(!profile)
      return this.unauthorized(res);
    
    const contractsBelongingToUser = await Contract.findAll({
      where: {
        ...Contract.queryUserBelongingContracts(profile.id),
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

    if(!unpaidJobs)
      return this.notFound(res);
    
    return this.ok(res, unpaidJobs);
  }

  /**
   * Pays job.
   * @returns 
   */
  async payJob(req, res) {
    const {profile} = req;
    const {job_id} = req.params;
    
    if(!profile)
      return this.unauthorized(res);
    
    // Get active contracts belonging to user
    const contractsBelongingToUser = await Contract.findAll({
      where: {
        ...Contract.queryUserBelongingContracts(profile.id),
        ...Contract.queryActiveContracts()
      }
    });

    const job = await Job.findOne({
      where: {
        id: job_id,
        ContractId: {
          [Op.in]: contractsBelongingToUser.map((contract) => contract.id)
        }
      }
    });

    if(!job)
      return this.notFound(res, 'Job not found.')
    // Check if jobId is an unpaid job

    if(job.paid === true)
      return this.unprocessableEntity(res, 'Job already paid.');
    
    // Find Contract
    const contract = await Contract.findOne({
      where: {
        id: job.ContractId
      }
    })

    if(!contract)
      return this.notFound(res, 'Contract for this Job was not found.')
    
    // Get Contractor
    const contractor = await Profile.findOne({
      where: {
        id: contract.ContractorId
      }
    })

    // Check if user balance >= job price
    if(profile.balance < job.price)
      return this.unprocessableEntity(res, 'You don\'t have enough balance to pay this job.');
    // Calculate new user balance
    const newUserBalance = profile.balance - job.price;
    // Calculate new contractor balance
    const newContractorBalance = contractor.balance + job.price;
    // remove price from user balance
    await Profile.update({
      balance: newUserBalance
    }, {
      where: {
        id: profile.id
      }
    });
    // add price on contractor balance
    await Profile.update({
      balance: newContractorBalance
    }, {
      where: {
        id: contractor.id
      }
    });
    // update contract as paid
    await Job.update({
      paid: true,
      paymentDate: new Date()
    }, {
      where: {
        id: job.id
      }
    });

    const paidJob = Job.findOne({
      where: {
        id: job.id
      }
    })
    
    return this.ok(res, {
      oldUserBalance: profile.balance,
      newUserBalance: newUserBalance,
      paidJob: paidJob
    });
  }
}

module.exports = { JobsController };
