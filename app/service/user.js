const { UserRepository } = require('../repositories/index');

// Initialize repository once
const userRepo = new UserRepository();

async function create(userData) {
  return await userRepo.create(userData);
}

async function getById(id) {
  return await userRepo.findById(id);
}

async function getUserWithRoles(id) {
  return await userRepo.findUserWithRoles(id);
}

async function update(id, updates) {
  return await userRepo.update(id, updates);
}

async function getAll() {
  return await userRepo.findAll();
}

async function getAllPaginated(page = 1, limit = 10) {
  return await userRepo.findAllWithPagination(page, limit);
}

async function getActiveUsers() {
  return await userRepo.findActiveUsers();
}

async function getActiveUsersPaginated(page = 1, limit = 10) {
  return await userRepo.findActiveUsersPaginated(page, limit);
}

async function getUsersWithRoles() {
  return await userRepo.findUsersWithRoles();
}

async function getUsersWithRolesPaginated(page = 1, limit = 10) {
  return await userRepo.findUsersWithRolesPaginated(page, limit);
}

async function findByEmail(email) {
  return await userRepo.findByEmail(email);
}

async function findByUserName(userName) {
  return await userRepo.findByUserName(userName);
}

async function emailExists(email) {
  return await userRepo.emailExists(email);
}

async function userNameExists(userName) {
  return await userRepo.userNameExists(userName);
}

async function softDelete(id) {
  return await userRepo.softDelete(id);
}

module.exports = {
  create,
  getById,
  getUserWithRoles,
  update,
  getAll,
  getAllPaginated,
  getActiveUsers,
  getActiveUsersPaginated,
  getUsersWithRoles,
  getUsersWithRolesPaginated,
  findByEmail,
  findByUserName,
  emailExists,
  userNameExists,
  softDelete,
};
