const { BaseRepository } = require('./base.repository');
const { Permission } = require('../models/index');

class PermissionRepository extends BaseRepository {
  constructor() {
    super(Permission);
  }

  async findByName(name) {
    return await this.repository.findOne({
      where: { name },
    });
  }

  async findByApi(api) {
    return await this.repository.findOne({
      where: { api },
    });
  }

  async findActivePermissions() {
    return await this.repository.find({
      where: {
        enable: true,
        deleted: false,
      },
    });
  }

  async findActivePermissionsPaginated(page = 1, limit = 10) {
    return await this.findWithPagination(page, limit, {
      where: {
        enable: true,
        deleted: false,
      },
    });
  }

  async permissionExists(name) {
    return await this.exists({ where: { name } });
  }

  async apiExists(api) {
    return await this.exists({ where: { api } });
  }

  async findPermissionsByIds(ids) {
    return await this.repository.findByIds(ids);
  }
}

module.exports = { PermissionRepository };
