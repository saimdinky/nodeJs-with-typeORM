const {
  UserRepository,
  ClientTokenRepository,
} = require('../repositories/index');
const jwt = require('jsonwebtoken');
const { compareSync } = require('bcrypt');
const { logger: log } = require('../utils/log/index');

// Initialize repositories once
const userRepo = new UserRepository();
const clientTokenRepo = new ClientTokenRepository();

async function signup(userData) {
  // Check if user already exists
  const existingUser = await userRepo.findByEmail(userData.email);
  if (existingUser) return null;

  // Create new user
  const savedUser = await userRepo.create(userData);
  return { user: savedUser };
}

async function login(email, password) {
  // Find active user with roles and permissions
  const user = await userRepo.findActiveUserByEmail(email);
  if (!user) return null;

  // Verify password
  const passwordIsValid = compareSync(password, user.password);
  if (!passwordIsValid) return null;

  log.info(user.roles[0].name);

  // Prepare JWT payload
  const data = {
    id: user.id,
    email: user.email,
    userName: user.userName,
    roles: user.roles,
  };

  // Generate JWT token
  const token = jwt.sign({ user: data }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });

  return {
    user: { id: user.id, userName: user.userName, email: user.email },
    token,
  };
}

async function getUserDetailsByToken(token) {
  const clientToken = await clientTokenRepo.findByToken(token);
  return clientToken ? { user: clientToken.user } : null;
}

async function getBasicTokenByClientId(clientId) {
  return await clientTokenRepo.findByClientName(clientId);
}

module.exports = {
  signup,
  login,
  getUserDetailsByToken,
  getBasicTokenByClientId,
};
