const { Op, fn } = require('sequelize');
const { BaseController } = require('./BaseController');
const {sequelize, Contract, Profile} = require('../model');
const {models} = sequelize;
const {Job} = models;

class AdminController extends BaseController {
  constructor() {
    super();
    this.bestProfession = this.bestProfession.bind(this);
    this.bestClients = this.bestClients.bind(this);
  }

  /**
   * Returns the profession that earned the most money (sum of jobs paid)
   * for any contactor that worked in the query time range.
   * @returns 
   */
  async bestProfession(req, res) {
    const {start, end} = req.query;

    const dateFilter = { [Op.and]: [{
      paymentDate: {
        [Op.not]: null,
      }
    }] };

    if(start) {
      dateFilter[Op.and].push({
        paymentDate: {
          [Op.gte]: start
        }
      })
    }
    if(end) {
      dateFilter[Op.and].push({
        paymentDate: {
          [Op.lte]: end
        }
      })
    }

    try {
      const jobs = await Job.findAll({
        attributes: [
          'ContractId',
          [sequelize.fn('sum', sequelize.col('price')), 'total_price'],
        ],
        where: {
          ...dateFilter,
          paid: {
            [Op.eq]: true,
          }
        },
        include: [{
          model: Contract,
          required: true,
          include: [{
            model: Profile,
            required: true,
            as: 'Contractor'
          }]
        }],
        group: ['ContractId']
      });

      const grouping = {}

      for(const job of jobs) {
        if(!grouping[job.Contract.Contractor.profession])
          grouping[job.Contract.Contractor.profession] = 0;
        grouping[job.Contract.Contractor.profession] += job.get('total_price');
      }
      const result = Object.keys(grouping).map((key) => [key, grouping[key]]).sort((a,b) => a[1] < b[1] ? 1 : -1)[0][0];
      return this.ok(res, result);
    } catch (err) {
      console.log(err);
      return this.unprocessableEntity(res, err.message)
    }
    
  }

  /**
   * Returns the clients the paid the most for jobs in the query time period.
   * Limit query parameter should be applied, default limit is 2.
   * @returns
   */
  async bestClients(req, res) {
    const {start, end, limit = 2} = req.query;

    const dateFilter = { [Op.and]: [{
      paymentDate: {
        [Op.not]: null,
      }
    }] };

    if(start) {
      dateFilter[Op.and].push({
        paymentDate: {
          [Op.gte]: start
        }
      })
    }
    if(end) {
      dateFilter[Op.and].push({
        paymentDate: {
          [Op.lte]: end
        }
      })
    }

    try {
      const jobs = await Job.findAll({
        attributes: [
          'ContractId',
          [sequelize.fn('sum', sequelize.col('price')), 'total_paid'],
        ],
        where: {
          ...dateFilter,
          paid: {
            [Op.eq]: true,
          }
        },
        include: [{
          model: Contract,
          required: true,
          include: [{
            model: Profile,
            required: true,
            as: 'Client'
          }]
        }],
        group: ['ContractId']
      });

      const grouping = {};

      for(const job of jobs) {
        if(!grouping[job.Contract.Client.id])
          grouping[job.Contract.Client.id] = {
            id: job.Contract.Client.id,
            fullName: `${job.Contract.Client.firstName} ${job.Contract.Client.lastName}`,
            paid: 0
          };
        grouping[job.Contract.Client.id].paid += job.get('total_paid');
      }
      const result = Object.keys(grouping).map((key) => [grouping[key], grouping[key].paid]).sort((a,b) => a[1] < b[1] ? 1 : -1).map((arr) => arr[0]).slice(0, limit);
      return this.ok(res, result);

    } catch (err) {
      return this.unprocessableEntity(res, err.message);
    }
  }
}

module.exports = { AdminController };
