const { AppDataSource } = require("../db/index");
const { Role } = require("..//models/index");
const { logger: log } = require("../utils/log/index");
const Response = require("../utils/res/index");

async function createRole(name, permissions = [], createdBy = "SYSTEM") {
  try {
    log.info(`🔍 Creating role: ${name}`);
    const roleRepo = AppDataSource.getRepository(Role);
    const role = new Role();
    role.name = name;
    role.permissions = permissions;
    role.createdBy = createdBy;
    const savedRole = await roleRepo.save(role);
    log.info(`✅ Role created: ${savedRole.id}`);
    return new Response("success", 201, "Role created successfully", savedRole);
  } catch (error) {
    log.error(`❌ Error creating role: ${error.message}`);
    return new Response("error", 500, "Failed to create role", null);
  }
}

async function getRole(id) {
  try {
    log.info(`🔍 Fetching role with ID: ${id}`);
    const roleRepo = AppDataSource.getRepository(Role);
    const role = await roleRepo.findOne({
      where: { id },
      relations: ["permissions"],
    });
    if (!role) {
      log.warn(`❌ Role not found: ${id}`);
      return new Response("error", 404, "Role not found", null);
    }
    log.info(`✅ Role fetched: ${id}`);
    return new Response("success", 200, "Role fetched successfully", role);
  } catch (error) {
    log.error(`❌ Error fetching role: ${error.message}`);
    return new Response("error", 500, "Failed to fetch role", null);
  }
}

async function updateRole(id, updates) {
  try {
    log.info(`🔍 Updating role with ID: ${id}`);
    const roleRepo = AppDataSource.getRepository(Role);
    const role = await roleRepo.findOne({
      where: { id },
      relations: ["permissions"],
    });
    if (!role) {
      log.warn(`❌ Role not found: ${id}`);
      return new Response("error", 404, "Role not found", null);
    }
    Object.assign(role, updates);
    const updatedRole = await roleRepo.save(role);
    log.info(`✅ Role updated: ${id}`);
    return new Response(
      "success",
      200,
      "Role updated successfully",
      updatedRole
    );
  } catch (error) {
    log.error(`❌ Error updating role: ${error.message}`);
    return new Response("error", 500, "Failed to update role", null);
  }
}

async function deleteRole(id) {
  try {
    log.info(`🔍 Deleting role with ID: ${id}`);
    const roleRepo = AppDataSource.getRepository(Role);
    const role = await roleRepo.findOne({ where: { id } });
    if (!role) {
      log.warn(`❌ Role not found: ${id}`);
      return new Response("error", 404, "Role not found", null);
    }
    await roleRepo.remove(role);
    log.info(`✅ Role deleted: ${id}`);
    return new Response("success", 200, "Role deleted successfully", null);
  } catch (error) {
    log.error(`❌ Error deleting role: ${error.message}`);
    return new Response("error", 500, "Failed to delete role", null);
  }
}

async function getAllRoles() {
  try {
    log.info("🔍 Fetching all roles");
    const roleRepo = AppDataSource.getRepository(Role);
    const roles = await roleRepo.find({ relations: ["permissions"] });
    log.info(`✅ Fetched ${roles.length} roles`);
    return new Response("success", 200, "Roles fetched successfully", roles);
  } catch (error) {
    log.error(`❌ Error fetching roles: ${error.message}`);
    return new Response("error", 500, "Failed to fetch roles", null);
  }
}

module.exports = { createRole, getRole, updateRole, deleteRole, getAllRoles };
