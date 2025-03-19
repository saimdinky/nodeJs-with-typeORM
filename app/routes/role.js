const router = require('express').Router();
const {
  createRole,
  getRole,
  updateRole,
  deleteRole,
  getAllRoles,
} = require('../controllers/role');

router.post('/', async (req, res) => {
  const response = await createRole(req.body, req.currentUser.userName);
  return res.status(response.statusCode).json(response.toJSON());
});

router.get('/:id', async (req, res) => {
  const response = await getRole(parseInt(req.params.id));
  return res.status(response.statusCode).json(response.toJSON());
});

router.put('/:id', async (req, res) => {
  const response = await updateRole(parseInt(req.params.id), req.body);
  return res.status(response.statusCode).json(response.toJSON());
});

router.delete('/:id', async (req, res) => {
  const response = await deleteRole(parseInt(req.params.id));
  return res.status(response.statusCode).json(response.toJSON());
});

router.get('/', async (req, res) => {
  const response = await getAllRoles();
  return res.status(response.statusCode).json(response.toJSON());
});

module.exports = router;
