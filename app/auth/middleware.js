const { compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { setCurrentUser, logger } = require('../utils/log/index');
const { logger: log } = require('../utils/log/index');
const Response = require('../utils/res/index');
const {
  getBasicTokenByClientIdController,
  allowedToAccessResourceController,
} = require('../controllers/auth');

const authorizer = async (req, res, next) => {
  try {
    const authToken = req.headers.Authorization || req.headers.authorization;
    if (!authToken) {
      log.warn('❌ Authentication Token Not Found');
      const response = new Response(
        'error',
        401,
        'Authentication Token Not Found',
        null,
      );
      return res.status(response.statusCode).json(response.toJSON());
    }
    const token = authToken.split(' ');
    if (token[0].trim() === 'Basic') {
      log.info('🔑 Handling Basic authentication');
      return await handleAuthRoutes({ token: token[1].trim(), req, res, next });
    } else if (token[0] === 'Bearer') {
      log.info('🔑 Handling Bearer authentication');
      return await handleBearer({ token: token[1].trim(), req, res, next });
    } else {
      log.warn('❌ Unauthorized: Invalid token type');
      return Response('error', 401, 'Unauthorized', null);
    }
  } catch (error) {
    log.error(`❌ Authentication error: ${error.message}`);
    return res.status(401).json({ error: error.message });
  }
};

const handleAuthRoutes = async ({ token, req, res, next }) => {
  try {
    const decodedToken = Buffer.from(token, 'base64').toString();
    const [clientId, clientSecret] = decodedToken.split(':');
    if (!clientId || !clientSecret) {
      log.warn('❌ Invalid Basic token format');
      const response = new Response('error', 401, 'Unauthorized', null);
      return res.status(response.statusCode).json(response.toJSON());
    }
    const clientResponse = await getBasicTokenByClientIdController(clientId);
    if (clientResponse.status === 'error') {
      log.warn(`❌ Client not found or error for clientId: ${clientId}`);
      const response = new Response('error', 401, 'Unauthorized', null);
      return res.status(response.statusCode).json(response.toJSON());
    }
    const client = clientResponse.data;
    log.info(`🔍 Client found: ${clientId}`);
    const passwordIsValid = compareSync(clientSecret, client.token);
    log.info(`🔍 Password validation result: ${passwordIsValid}`);
    if (!passwordIsValid) {
      log.warn('❌ Invalid client secret');
      const response = new Response(
        'error',
        401,
        'Authentication Failed, Invalid Token',
        null,
      );
      return res.status(response.statusCode).json(response.toJSON());
    }
    log.info('✅ Basic authentication successful');
    next();
  } catch (err) {
    log.error(`❌ Basic auth exception: ${err.message}`);
    return res.status(401).json({ error: err.message });
  }
};

const handleBearer = async ({ token, req, res, next }) => {
  try {
    log.info(`🔍 Retrieving user details for Bearer token: ${token}`);
    const tokenUser = jwt.verify(token, process.env.JWT_SECRET);
    const requestedResource = `${req.method}:/${
      req.originalUrl.split('api/')[1].split('?')[0]
    }`;
    log.info(`🔍 Checking access for resource: ${requestedResource}`);
    const user = tokenUser.user;
    logger.info('user ');
    const isAdmin = user.roles.some((role) => role.name === 'root');
    if (!isAdmin) {
      const accessResponse = allowedToAccessResourceController(
        user,
        requestedResource,
      );
      if (accessResponse.status === 'error' || !accessResponse.data) {
        log.warn(
          `❌ Access denied for user: ${user.userName} to resource: ${requestedResource}`,
        );
        const response = new Response(
          'error',
          401,
          'Not authorized to access this resource',
          null,
        );
        return res.status(response.statusCode).json(response.toJSON());
      }
    }
    log.info(
      `✅ Access granted for user: ${user.userName} to resource: ${requestedResource}`,
    );
    req.currentUser = user;
    setCurrentUser(user.userName);
    next();
  } catch (error) {
    log.error(`❌ Bearer auth error: ${error.message}`);
    return res.status(401).json({ error: error.message });
  }
};

module.exports = {
  authorizer,
};
