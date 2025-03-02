const { AppDataSource } = require("../db/index");
const { ClientToken, User } = require("../models/index");
const { logger: log } = require("../utils/log/index");
const jwt = require("jsonwebtoken");

async function signup(userData) {
  try {
    log.info(`🔍 Signing up user: ${userData.userName}`);
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      log.warn(`❌ User already exists: ${userData.email}`);
      return new Response("error", 409, "User already exists", null);
    }
    const user = new User();
    Object.assign(user, userData);
    const savedUser = await userRepo.save(user);
    log.info(`✅ User signed up: ${savedUser.userName}`);

    const tokenRepo = AppDataSource.getRepository(ClientToken);
    const token = jwt.sign({ id: savedUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const clientToken = new ClientToken();
    clientToken.token = token;
    clientToken.user = savedUser;
    await tokenRepo.save(clientToken);

    log.info(`✅ Token generated for user: ${savedUser.userName}`);
    return new Response("success", 201, "User signed up successfully", {
      user: savedUser,
      token,
    });
  } catch (error) {
    log.error(`❌ Error during signup: ${error.message}`);
    return new Response("error", 500, "Failed to sign up user", null);
  }
}

async function login(email, password) {
  try {
    log.info(`🔍 Logging in user with email: ${email}`);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { email },
      select: ["id", "email", "password", "userName"],
    });
    if (!user) {
      log.warn(`❌ User not found: ${email}`);
      return new Response("error", 401, "Invalid credentials", null);
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      log.warn(`❌ Invalid password for user: ${email}`);
      return new Response("error", 401, "Invalid credentials", null);
    }
    const tokenRepo = AppDataSource.getRepository(ClientToken);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const clientToken = new ClientToken();
    clientToken.token = token;
    clientToken.user = user;
    await tokenRepo.save(clientToken);

    log.info(`✅ User logged in: ${user.userName}`);
    return new Response("success", 200, "Login successful", {
      user: { id: user.id, userName: user.userName, email: user.email },
      token,
    });
  } catch (error) {
    log.error(`❌ Error during login: ${error.message}`);
    return new Response("error", 500, "Failed to login", null);
  }
}

async function getUserDetailsByToken(token) {
  try {
    log.info(`🔍 Retrieving user details for token: ${token}`);
    const clientTokenRepo = AppDataSource.getRepository(ClientToken);
    const clientToken = await clientTokenRepo.findOne({
      where: { token },
      relations: ["user", "user.roles"],
    });
    if (clientToken) {
      log.info(`✅ User details retrieved for token: ${token}`);
      return new Response("success", 200, "User details retrieved", {
        user: clientToken.user,
      });
    } else {
      log.warn(`❌ No user details found for token: ${token}`);
      return new Response("error", 400, "Invalid Token Found", null);
    }
  } catch (error) {
    log.error(`❌ Failed to retrieve user details: ${error.message}`);
    return new Response(
      "error",
      500,
      `Failed to retrieve user details: ${error.message}`,
      null
    );
  }
}

function allowedToAccessResource(user, requestedResource) {
  try {
    log.info(
      `🔍 Checking access for user: ${user.userName} to resource: ${requestedResource}`
    );
    for (const role of user.roles) {
      if (
        role.permissions &&
        role.permissions.some((perm) => perm.api === requestedResource)
      ) {
        log.info(
          `✅ Access granted for user: ${user.userName} to resource: ${requestedResource}`
        );
        return new Response("success", 200, "Access granted", true);
      }
    }
    log.warn(
      `❌ Access denied for user: ${user.userName} to resource: ${requestedResource}`
    );
    return new Response("error", 403, "Access denied", false);
  } catch (error) {
    log.error(`❌ Failed to check resource access: ${error.message}`);
    return new Response(
      "error",
      500,
      `Failed to check resource access: ${error.message}`,
      null
    );
  }
}

async function getBasicTokenByClientId(clientId) {
  try {
    log.info(`🔍 Retrieving client token for clientId: ${clientId}`);
    const clientTokenRepo = AppDataSource.getRepository(ClientToken);
    const clientToken = await clientTokenRepo.findOne({ where: { clientId } });
    if (clientToken) {
      log.info(`✅ Client token retrieved for clientId: ${clientId}`);
      return new Response(
        "success",
        200,
        "Client token retrieved",
        clientToken
      );
    } else {
      log.warn(`❌ No client token found for clientId: ${clientId}`);
      return new Response(
        "error",
        401,
        "Authentication Failed, Invalid Client",
        null
      );
    }
  } catch (error) {
    log.error(`❌ Failed to retrieve client token: ${error.message}`);
    return new Response(
      "error",
      500,
      `Failed to retrieve client token: ${error.message}`,
      null
    );
  }
}

module.exports = {
  getUserDetailsByToken,
  allowedToAccessResource,
  getBasicTokenByClientId,
  login,
  signup,
};
