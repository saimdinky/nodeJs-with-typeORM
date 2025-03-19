const { logger: log } = require('../utils/log/index');
const {
  signup,
  login,
  getUserDetailsByToken,
  getBasicTokenByClientId,
} = require('../service/auth');
const Response = require('../utils/res/index');

async function signupController(userData) {
  try {
    log.info(`🔍 Signing up user: ${userData.userName}`);
    const result = await signup(userData);
    if (!result) {
      log.warn(`❌ User already exists: ${userData.email}`);
      return new Response('error', 409, 'User already exists', null);
    }
    log.info(`✅ User signed up: ${result.user.userName}`);
    return new Response('success', 201, 'User signed up successfully', result);
  } catch (error) {
    log.error(`❌ Error during signup: ${error.message}`);
    return new Response('error', 500, 'Failed to sign up user', null);
  }
}

async function loginController(email, password) {
  try {
    log.info(`🔍 Logging in user with email: ${email}`);
    const result = await login(email, password);
    if (!result) {
      log.warn(`❌ Invalid credentials for email: ${email}`);
      return new Response('error', 401, 'Invalid credentials', null);
    }
    log.info(`✅ User logged in: ${result.user.userName}`);
    return new Response('success', 200, 'Login successful', result);
  } catch (error) {
    log.error(`❌ Error during login: ${error.message}`);
    return new Response('error', 500, 'Failed to login', null);
  }
}

async function getUserDetailsByTokenController(token) {
  try {
    log.info(`🔍 Retrieving user details for token: ${token}`);
    const result = await getUserDetailsByToken(token);
    if (!result) {
      log.warn(`❌ No user details found for token: ${token}`);
      return new Response('error', 400, 'Invalid Token Found', null);
    }
    log.info(`✅ User details retrieved for token: ${token}`);
    return new Response('success', 200, 'User details retrieved', result);
  } catch (error) {
    log.error(`❌ Failed to retrieve user details: ${error.message}`);
    return new Response(
      'error',
      500,
      `Failed to retrieve user details: ${error.message}`,
      null,
    );
  }
}

function allowedToAccessResourceController(user, requestedResource) {
  try {
    log.info(
      `🔍 Checking access for user: ${user.userName} to resource: ${requestedResource}`,
    );
    for (const role of user.roles) {
      if (
        role.permissions &&
        role.permissions.some((perm) => perm.api === requestedResource)
      ) {
        log.info(
          `✅ Access granted for user: ${user.userName} to resource: ${requestedResource}`,
        );
        return new Response('success', 200, 'Access granted', true);
      }
    }
    log.warn(
      `❌ Access denied for user: ${user.userName} to resource: ${requestedResource}`,
    );
    return new Response('error', 403, 'Access denied', false);
  } catch (error) {
    log.error(`❌ Failed to check resource access: ${error.message}`);
    return new Response(
      'error',
      500,
      `Failed to check resource access: ${error.message}`,
      null,
    );
  }
}

async function getBasicTokenByClientIdController(clientId) {
  try {
    log.info(`🔍 Retrieving client token for clientId: ${clientId}`);
    const clientToken = await getBasicTokenByClientId(clientId);
    if (!clientToken) {
      log.warn(`❌ No client token found for clientId: ${clientId}`);
      return new Response(
        'error',
        401,
        'Authentication Failed, Invalid Client',
        null,
      );
    }
    log.info(`✅ Client token retrieved for clientId: ${clientId}`);
    return new Response('success', 200, 'Client token retrieved', clientToken);
  } catch (error) {
    log.error(`❌ Failed to retrieve client token: ${error.message}`);
    return new Response(
      'error',
      500,
      `Failed to retrieve client token: ${error.message}`,
      null,
    );
  }
}

module.exports = {
  signupController,
  loginController,
  getUserDetailsByTokenController,
  allowedToAccessResourceController,
  getBasicTokenByClientIdController,
};
