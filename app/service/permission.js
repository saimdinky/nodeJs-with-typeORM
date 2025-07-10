const { PermissionRepository } = require('../repositories/index');

// Initialize repository once
const permissionRepo = new PermissionRepository();

async function create(name, api, createdBy) {
  return await permissionRepo.create({ name, api, createdBy });
}

async function getById(id) {
  return await permissionRepo.findById(id);
}

async function update(id, updates) {
  return await permissionRepo.update(id, updates);
}

async function getAll() {
  return await permissionRepo.findAll();
}

async function getAllPaginated(page = 1, limit = 10) {
  return await permissionRepo.findAllWithPagination(page, limit);
}

async function getActivePermissions() {
  return await permissionRepo.findActivePermissions();
}

async function getActivePermissionsPaginated(page = 1, limit = 10) {
  return await permissionRepo.findActivePermissionsPaginated(page, limit);
}

async function permissionExists(name) {
  return await permissionRepo.permissionExists(name);
}

async function apiExists(api) {
  return await permissionRepo.apiExists(api);
}

async function softDelete(id) {
  return await permissionRepo.softDelete(id);
}

module.exports = {
  create,
  getById,
  update,
  getAll,
  getAllPaginated,
  getActivePermissions,
  getActivePermissionsPaginated,
  permissionExists,
  apiExists,
  softDelete,
};
