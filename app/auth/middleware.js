const { compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { setCurrentUser } = require("../utils/log/index");
const { logger: log } = require("../utils/log/index");
const Response = require("../utils/res/index");
const {
  getBasicTokenByClientId,
  allowedToAccessResource,
} = require("../service/auth");

const authorizer = async (req, res, next) => {
  try {
    const authToken = req.headers.Authorization || req.headers.authorization;
    if (!authToken) {
      log.warn("❌ Authentication Token Not Found");
      return new Response("error", 401, "Authentication Token Not Found", null);
    }
    const token = authToken.split(" ");
    if (token[0].trim() === "Basic") {
      log.info("🔑 Handling Basic authentication");
      return await handleAuthRoutes({ token: token[1].trim(), req, res, next });
    } else if (token[0] === "Bearer") {
      log.info("🔑 Handling Bearer authentication");
      return await handleBearer({ token: token[1].trim(), req, res, next });
    } else {
      log.warn("❌ Unauthorized: Invalid token type");
      return Response("error", 401, "Unauthorized", null);
    }
  } catch (error) {
    log.error(`❌ Authentication error: ${error.message}`);
    next(error);
  }
};

const handleAuthRoutes = async ({ token, req, res, next }) => {
  try {
    const decodedToken = Buffer.from(token, "base64").toString();
    const [clientId, clientSecret] = decodedToken.split(":");
    if (!clientId || !clientSecret) {
      log.warn("❌ Invalid Basic token format");
      return new Response("error", 401, "Unauthorized", null);
    }
    log.info(`🔍 Retrieving client token for clientId: ${clientId}`);
    const clientResponse = await getBasicTokenByClientId(clientId);
    if (clientResponse.status === "error") {
      log.warn(`❌ Client not found or error for clientId: ${clientId}`);
      return new Response("error", 401, "Unauthorized", null);
    }
    const client = clientResponse.data;
    log.info(`🔍 Client found: ${clientId}`);
    const passwordIsValid = compareSync(clientSecret, client.clientSecret);
    log.info(`🔍 Password validation result: ${passwordIsValid}`);
    if (!passwordIsValid) {
      log.warn("❌ Invalid client secret");
      return new Response(
        "error",
        401,
        "Authentication Failed, Invalid Token",
        null
      );
    }
    log.info("✅ Basic authentication successful");
    next();
  } catch (err) {
    log.error(`❌ Basic auth exception: ${err.message}`);
    next(err);
  }
};

const handleBearer = async ({ token, req, res, next }) => {
  try {
    log.info(`🔍 Retrieving user details for Bearer token: ${token}`);
    jwt.verify(token, process.env.JWT_SECRET);
    const requestedResource = `${req.method}:/${
      req.originalUrl.split("api/")[1].split("?")[0]
    }`;
    log.info(`🔍 Checking access for resource: ${requestedResource}`);
    const isAdmin = user.roles.some((role) => role.name === "admin");
    if (!isAdmin) {
      const accessResponse = allowedToAccessResource(user, requestedResource);
      if (accessResponse.status === "error" || !accessResponse.data) {
        log.warn(
          `❌ Access denied for user: ${user.userName} to resource: ${requestedResource}`
        );
        return new Response(
          "error",
          401,
          "Not authorized to access this resource",
          null
        );
      }
    }
    log.info(
      `✅ Access granted for user: ${user.userName} to resource: ${requestedResource}`
    );
    req.currentUser = user;
    setCurrentUser(user.userName);
    next();
  } catch (error) {
    log.error(`❌ Bearer auth error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  authorizer,
};
