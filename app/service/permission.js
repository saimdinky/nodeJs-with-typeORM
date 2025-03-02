const { AppDataSource } = require("../db/index");
const { Permission } = require("../models/index");
const { logger: log } = require("../utils/log/index");
const Response = require("../utils/res/index");

async function createPermission(name, api, createdBy = "SYSTEM") {
  try {
    log.info(`🔍 Creating permission: ${name}`);
    const permRepo = AppDataSource.getRepository(Permission);
    const permission = new Permission();
    permission.name = name;
    permission.api = api;
    permission.createdBy = createdBy;
    const savedPermission = await permRepo.save(permission);
    log.info(`✅ Permission created: ${savedPermission.id}`);
    return new Response(
      "success",
      201,
      "Permission created successfully",
      savedPermission
    );
  } catch (error) {
    log.error(`❌ Error creating permission: ${error.message}`);
    return new Response("error", 500, "Failed to create permission", null);
  }
}

async function getPermission(id) {
  try {
    log.info(`🔍 Fetching permission with ID: ${id}`);
    const permRepo = AppDataSource.getRepository(Permission);
    const permission = await permRepo.findOne({ where: { id } });
    if (!permission) {
      log.warn(`❌ Permission not found: ${id}`);
      return new Response("error", 404, "Permission not found", null);
    }
    log.info(`✅ Permission fetched: ${id}`);
    return new Response(
      "success",
      200,
      "Permission fetched successfully",
      permission
    );
  } catch (error) {
    log.error(`❌ Error fetching permission: ${error.message}`);
    return new Response("error", 500, "Failed to fetch permission", null);
  }
}

async function updatePermission(id, updates) {
  try {
    log.info(`🔍 Updating permission with ID: ${id}`);
    const permRepo = AppDataSource.getRepository(Permission);
    const permission = await permRepo.findOne({ where: { id } });
    if (!permission) {
      log.warn(`❌ Permission not found: ${id}`);
      return new Response("error", 404, "Permission not found", null);
    }
    Object.assign(permission, updates);
    const updatedPermission = await permRepo.save(permission);
    log.info(`✅ Permission updated: ${id}`);
    return new Response(
      "success",
      200,
      "Permission updated successfully",
      updatedPermission
    );
  } catch (error) {
    log.error(`❌ Error updating permission: ${error.message}`);
    return new Response("error", 500, "Failed to update permission", null);
  }
}

async function deletePermission(id) {
  try {
    log.info(`🔍 Deleting permission with ID: ${id}`);
    const permRepo = AppDataSource.getRepository(Permission);
    const permission = await permRepo.findOne({ where: { id } });
    if (!permission) {
      log.warn(`❌ Permission not found: ${id}`);
      return new Response("error", 404, "Permission not found", null);
    }
    await permRepo.remove(permission);
    log.info(`✅ Permission deleted: ${id}`);
    return new Response(
      "success",
      200,
      "Permission deleted successfully",
      null
    );
  } catch (error) {
    log.error(`❌ Error deleting permission: ${error.message}`);
    return new Response("error", 500, "Failed to delete permission", null);
  }
}

async function getAllPermissions() {
  try {
    log.info("🔍 Fetching all permissions");
    const permRepo = AppDataSource.getRepository(Permission);
    const permissions = await permRepo.find();
    log.info(`✅ Fetched ${permissions.length} permissions`);
    return new Response(
      "success",
      200,
      "Permissions fetched successfully",
      permissions
    );
  } catch (error) {
    log.error(`❌ Error fetching permissions: ${error.message}`);
    return new Response("error", 500, "Failed to fetch permissions", null);
  }
}

module.exports = {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
};
