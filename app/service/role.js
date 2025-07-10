const { RoleRepository } = require('../repositories/index');

// Initialize repository once
const roleRepo = new RoleRepository();

async function create(name, permissions, createdBy) {
  return await roleRepo.createWithPermissions({ name, createdBy }, permissions);
}

async function getById(id) {
  return await roleRepo.findWithPermissions(id);
}

async function update(id, updates) {
  return await roleRepo.update(id, updates);
}

async function getAll() {
  return await roleRepo.findAllWithPermissions();
}

async function getAllPaginated(page = 1, limit = 10) {
  return await roleRepo.findAllWithPermissionsPaginated(page, limit);
}

async function getActiveRoles() {
  return await roleRepo.findActiveRoles();
}

async function getActiveRolesPaginated(page = 1, limit = 10) {
  return await roleRepo.findActiveRolesPaginated(page, limit);
}

async function roleExists(name) {
  return await roleRepo.roleExists(name);
}

async function softDelete(id) {
  return await roleRepo.softDelete(id);
}

module.exports = {
  create,
  getById,
  update,
  getAll,
  getAllPaginated,
  getActiveRoles,
  getActiveRolesPaginated,
  roleExists,
  softDelete,
};
