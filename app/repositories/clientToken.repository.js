const { BaseRepository } = require('./base.repository');
const { ClientToken } = require('../models/index');

class ClientTokenRepository extends BaseRepository {
  constructor() {
    super(ClientToken);
  }

  async findByToken(token) {
    return await this.repository.findOne({
      where: { token },
      relations: ['user', 'user.roles'],
    });
  }

  async findByClientName(clientName) {
    return await this.repository.findOne({
      where: { clientName },
    });
  }

  async findActiveTokens() {
    return await this.repository.find({
      where: { active: true },
    });
  }

  async deactivateToken(token) {
    return await this.repository.update({ token }, { active: false });
  }

  async createToken(tokenData) {
    const token = this.repository.create(tokenData);
    return await this.repository.save(token);
  }
}

module.exports = { ClientTokenRepository };
