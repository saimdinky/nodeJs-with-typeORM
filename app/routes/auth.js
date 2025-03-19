const router = require('express').Router();
const { signupController, loginController } = require('../controllers/auth');

router.post('/signup', async (req, res) => {
  const response = await signupController(req.body);
  return res.status(response.statusCode).json(response.toJSON());
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const response = await loginController(email, password);
  return res.status(response.statusCode).json(response.toJSON());
});

module.exports = router;
