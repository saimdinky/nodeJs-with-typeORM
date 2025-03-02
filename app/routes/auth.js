const router = require("express").Router();
const { signup, login } = require("../service/auth");

router.post("/signup", async (req, res) => {
  return await signup(req.body);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  return await login(email, password);
});

module.exports = router;
