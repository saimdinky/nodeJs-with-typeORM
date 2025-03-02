const { AppDataSource } = require("../db/index");
const { ClientToken, User } = require("../models/index");
const jwt = require("jsonwebtoken");
const { compareSync } = require("bcrypt");
const { logger: log, logger } = require("../utils/log/index");

async function signup(userData) {
  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOne({
    where: { email: userData.email },
  });
  if (existingUser) return null; // Return null if user exists
  const user = new User();
  Object.assign(user, userData);
  const savedUser = await userRepo.save(user);
  return { user: savedUser };
}

async function login(email, password) {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { email, enable: true, deleted: false, status: "active" },
    select: ["id", "email", "password", "userName"],
    relations: ["roles", "roles.permissions"],
  });
  log.info(user.roles[0].name);
  const passwordIsValid = compareSync(password, user.password);
  if (!user || !passwordIsValid) return null;

  const data = {
    id: user.id,
    email: user.email,
    userName: user.userName,
    roles: user.roles,
  };
  //   log.info(data);
  const token = jwt.sign({ user: data }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  return {
    user: { id: user.id, userName: user.userName, email: user.email },
    token,
  };
}

async function getUserDetailsByToken(token) {
  const clientTokenRepo = AppDataSource.getRepository(ClientToken);
  const clientToken = await clientTokenRepo.findOne({
    where: { token },
    relations: ["user", "user.roles"],
  });
  return clientToken ? { user: clientToken.user } : null;
}

async function getBasicTokenByClientId(clientId) {
  const clientTokenRepo = AppDataSource.getRepository(ClientToken);
  return await clientTokenRepo.findOne({ where: { clientName: clientId } });
}

module.exports = {
  signup,
  login,
  getUserDetailsByToken,
  getBasicTokenByClientId,
};
