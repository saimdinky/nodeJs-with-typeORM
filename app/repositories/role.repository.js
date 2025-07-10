const { BaseRepository } = require('./base.repository');
const { Role } = require('../models/index');

class RoleRepository extends BaseRepository {
  constructor() {
    super(Role);
  }

  async findWithPermissions(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async findAllWithPermissions() {
    return await this.repository.find({
      relations: ['permissions'],
    });
  }

  async findAllWithPermissionsPaginated(page = 1, limit = 10) {
    return await this.findWithPagination(page, limit, {
      relations: ['permissions'],
    });
  }

  async findByName(name) {
    return await this.repository.findOne({
      where: { name },
    });
  }

  async findActiveRoles() {
    return await this.repository.find({
      where: {
        enable: true,
        deleted: false,
      },
      relations: ['permissions'],
    });
  }

  async findActiveRolesPaginated(page = 1, limit = 10) {
    return await this.findWithPagination(page, limit, {
      where: {
        enable: true,
        deleted: false,
      },
      relations: ['permissions'],
    });
  }

  async roleExists(name) {
    return await this.exists({ where: { name } });
  }

  async createWithPermissions(roleData, permissions) {
    const role = this.repository.create({
      ...roleData,
      permissions,
    });
    return await this.repository.save(role);
  }
}

module.exports = { RoleRepository };
