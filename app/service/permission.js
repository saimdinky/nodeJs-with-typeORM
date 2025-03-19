const { AppDataSource } = require('../db/index');
const { Permission } = require('../models/index');

async function create(name, api, createdBy) {
  const permRepo = AppDataSource.getRepository(Permission);
  const permission = new Permission();
  permission.name = name;
  permission.api = api;
  permission.createdBy = createdBy;
  return await permRepo.save(permission);
}

async function getById(id) {
  const permRepo = AppDataSource.getRepository(Permission);
  return await permRepo.findOne({ where: { id } });
}

async function update(id, updates) {
  const permRepo = AppDataSource.getRepository(Permission);
  const permission = await permRepo.findOne({ where: { id } });
  if (!permission) return null;
  Object.assign(permission, updates);
  return await permRepo.save(permission);
}

async function remove(id) {
  const permRepo = AppDataSource.getRepository(Permission);
  const permission = await permRepo.findOne({ where: { id } });
  if (!permission) return null;
  return await permRepo.remove(permission);
}

async function getAll() {
  const permRepo = AppDataSource.getRepository(Permission);
  return await permRepo.find();
}

module.exports = {
  create,
  getById,
  update,
  remove,
  getAll,
};
