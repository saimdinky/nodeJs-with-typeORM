const { logger: log } = require('../utils/log/index');
const {
  create,
  getById,
  update,
  remove,
  getAll,
} = require('../service/permission');
const Response = require('../utils/res/index');

async function createPermission({ name, api }, createdBy = 'SYSTEM') {
  try {
    log.info(`🔍 Creating permission: ${name}`);
    const savedPermission = await create(name, api, createdBy);
    log.info(`✅ Permission created: ${savedPermission.id}`);
    return new Response(
      'success',
      201,
      'Permission created successfully',
      savedPermission,
    );
  } catch (error) {
    log.error(`❌ Error creating permission: ${error.message}`);
    return new Response('error', 500, 'Failed to create permission', null);
  }
}

async function getPermission(id) {
  try {
    log.info(`🔍 Fetching permission with ID: ${id}`);
    const permission = await getById(id);
    if (!permission) {
      log.warn(`❌ Permission not found: ${id}`);
      return new Response('error', 404, 'Permission not found', null);
    }
    log.info(`✅ Permission fetched: ${id}`);
    return new Response(
      'success',
      200,
      'Permission fetched successfully',
      permission,
    );
  } catch (error) {
    log.error(`❌ Error fetching permission: ${error.message}`);
    return new Response('error', 500, 'Failed to fetch permission', null);
  }
}

async function updatePermission(id, updates) {
  try {
    log.info(`🔍 Updating permission with ID: ${id}`);
    const updatedPermission = await update(id, updates);
    if (!updatedPermission) {
      log.warn(`❌ Permission not found: ${id}`);
      return new Response('error', 404, 'Permission not found', null);
    }
    log.info(`✅ Permission updated: ${id}`);
    return new Response(
      'success',
      200,
      'Permission updated successfully',
      updatedPermission,
    );
  } catch (error) {
    log.error(`❌ Error updating permission: ${error.message}`);
    return new Response('error', 500, 'Failed to update permission', null);
  }
}

async function deletePermission(id) {
  try {
    log.info(`🔍 Deleting permission with ID: ${id}`);
    const deletedPermission = await remove(id);
    if (!deletedPermission) {
      log.warn(`❌ Permission not found: ${id}`);
      return new Response('error', 404, 'Permission not found', null);
    }
    log.info(`✅ Permission deleted: ${id}`);
    return new Response(
      'success',
      200,
      'Permission deleted successfully',
      null,
    );
  } catch (error) {
    log.error(`❌ Error deleting permission: ${error.message}`);
    return new Response('error', 500, 'Failed to delete permission', null);
  }
}

async function getAllPermissions() {
  try {
    log.info('🔍 Fetching all permissions');
    const permissions = await getAll();
    log.info(`✅ Fetched ${permissions.length} permissions`);
    return new Response(
      'success',
      200,
      'Permissions fetched successfully',
      permissions,
    );
  } catch (error) {
    log.error(`❌ Error fetching permissions: ${error.message}`);
    return new Response('error', 500, 'Failed to fetch permissions', null);
  }
}

module.exports = {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
};
