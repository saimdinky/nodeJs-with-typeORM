const router = require('express').Router();
const {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
} = require('../controllers/permission');

router.post('/', async (req, res) => {
  const response = await createPermission(req.body, req.currentUser.userName);
  return res.status(response.statusCode).json(response.toJSON());
});

router.get('/:id', async (req, res) => {
  const response = await getPermission(parseInt(req.params.id));
  return res.status(response.statusCode).json(response.toJSON());
});

router.put('/:id', async (req, res) => {
  const response = await updatePermission(parseInt(req.params.id), req.body);
  return res.status(response.statusCode).json(response.toJSON());
});

router.delete('/:id', async (req, res) => {
  const response = await deletePermission(parseInt(req.params.id));
  return res.status(response.statusCode).json(response.toJSON());
});

router.get('/', async (req, res) => {
  const response = await getAllPermissions();
  return res.status(response.statusCode).json(response.toJSON());
});

module.exports = router;
