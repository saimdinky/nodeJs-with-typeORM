const { UserRepository } = require('./user.repository');
const { RoleRepository } = require('./role.repository');
const { PermissionRepository } = require('./permission.repository');
const { ClientTokenRepository } = require('./clientToken.repository');

module.exports = {
  UserRepository,
  RoleRepository,
  PermissionRepository,
  ClientTokenRepository,
};
