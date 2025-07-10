const { BaseRepository } = require('./base.repository');
const { User } = require('../models/index');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async findActiveUserByEmail(email) {
    return await this.repository.findOne({
      where: {
        email,
        enable: true,
        deleted: false,
        status: 'active',
      },
      select: ['id', 'email', 'password', 'userName'],
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findByUserName(userName) {
    return await this.repository.findOne({
      where: { userName },
    });
  }

  async findActiveUsers() {
    return await this.repository.find({
      where: {
        enable: true,
        deleted: false,
        status: 'active',
      },
    });
  }

  async findActiveUsersPaginated(page = 1, limit = 10) {
    return await this.findWithPagination(page, limit, {
      where: {
        enable: true,
        deleted: false,
        status: 'active',
      },
    });
  }

  async emailExists(email) {
    return await this.exists({ where: { email } });
  }

  async userNameExists(userName) {
    return await this.exists({ where: { userName } });
  }

  async findUsersWithRoles() {
    return await this.repository.find({
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findUsersWithRolesPaginated(page = 1, limit = 10) {
    return await this.findWithPagination(page, limit, {
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findUserWithRoles(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
  }
}

module.exports = { UserRepository };
