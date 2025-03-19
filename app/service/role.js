const { AppDataSource } = require('../db/index');
const { Role } = require('../models/index');

async function create(name, permissions, createdBy) {
  const roleRepo = AppDataSource.getRepository(Role);
  const role = new Role();
  role.name = name;
  role.permissions = permissions;
  role.createdBy = createdBy;
  return await roleRepo.save(role);
}

async function getById(id) {
  const roleRepo = AppDataSource.getRepository(Role);
  return await roleRepo.findOne({ where: { id }, relations: ['permissions'] });
}

async function update(id, updates) {
  const roleRepo = AppDataSource.getRepository(Role);
  const role = await roleRepo.findOne({
    where: { id },
    relations: ['permissions'],
  });
  if (!role) return null;
  Object.assign(role, updates);
  return await roleRepo.save(role);
}

async function remove(id) {
  const roleRepo = AppDataSource.getRepository(Role);
  const role = await roleRepo.findOne({ where: { id } });
  if (!role) return null;
  return await roleRepo.remove(role);
}

async function getAll() {
  const roleRepo = AppDataSource.getRepository(Role);
  return await roleRepo
    .createQueryBuilder('role')
    .leftJoinAndSelect('role.permissions', 'permission')
    .where('role.enable = :enable', { enable: true })
    .andWhere('role.deleted = :deleted', { deleted: false })
    .andWhere('permission.enable = :permEnable', { permEnable: true })
    .andWhere('permission.deleted = :permDeleted', { permDeleted: false })
    .select([
      'role.id',
      'role.name',
      'role.createdBy',
      'role.enable',
      'role.deleted',
      'permission.id',
      'permission.name',
      'permission.api',
    ])
    .getMany();
}

module.exports = {
  create,
  update,
  remove,
  getAll,
  getById,
};
