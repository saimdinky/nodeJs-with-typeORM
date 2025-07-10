const { AppDataSource } = require('../db/index');

class BaseRepository {
  constructor(entity) {
    this.entity = entity;
    this.repository = AppDataSource.getRepository(entity);
  }

  async findById(id, relations = []) {
    return await this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findOne(options) {
    return await this.repository.findOne(options);
  }

  async find(options = {}) {
    return await this.repository.find(options);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findWithPagination(page = 1, limit = 10, options = {}) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      ...options,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  async findAllWithPagination(page = 1, limit = 10) {
    return await this.findWithPagination(page, limit);
  }

  async save(entity) {
    return await this.repository.save(entity);
  }

  async create(data) {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(id, updates) {
    const entity = await this.findById(id);
    if (!entity) return null;
    Object.assign(entity, updates);
    return await this.repository.save(entity);
  }

  async delete(id) {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async softDelete(id) {
    return await this.update(id, { deleted: true });
  }

  async count(options = {}) {
    return await this.repository.count(options);
  }

  async exists(options) {
    const count = await this.repository.count(options);
    return count > 0;
  }
}

module.exports = { BaseRepository };
