const { BaseController } = require('./BaseController');
const {sequelize} = require('../model');
const { Op } = require('sequelize');
const {models} = sequelize;
const {Contract} = models;

class ContractsController extends BaseController {
  constructor() {
    super();
    this.getContractForProfile = this.getContractForProfile.bind(this);
    this.getContractsForProfile = this.getContractsForProfile.bind(this);
  }

  /**
   * FIX ME!
   * @returns contracts for the authenticated profile
   */
  async getContractForProfile(req, res) {
    const {id} = req.params
    const {profile} = req;

    if(!profile)
      return this.unauthorized(res);

    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: {
          ContractorId: profile.id,
          ClientId: profile.id
        },
      }
    });

    if(!contract)
      return this.notFound(res);

    return this.ok(res, contract);
  }

  /**
   * Returns a list of non-terminated contracts belonging to a user (client or contractor).
   * @returns 
   */
  async getContractsForProfile(req, res) {
    const {profile} = req;
    
    if(!profile)
      return this.unauthorized(res);

    const contracts = await Contract.findAll({
      where: {
        [Op.or]: {
          ContractorId: profile.id,
          ClientId: profile.id
        },
        status: {
          [Op.notIn]: ['terminated']
        }
      }
    });

    if(!contracts)
      return this.notFound(res);
    
    return this.ok(res, contracts);
  }
}

module.exports = { ContractsController };
