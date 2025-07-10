const router = require('express').Router();
const {
  createRole,
  getRole,
  updateRole,
  deleteRole,
  getAllRoles,
  getActiveRolesOnly,
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
  const page = req.query.page ? parseInt(req.query.page) : null;
  const limit = req.query.limit ? parseInt(req.query.limit) : null;

  if ((page && page < 1) || (limit && limit < 1)) {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Page and limit must be positive numbers',
      data: null,
    });
  }

  const response = await getAllRoles(page, limit);
  return res.status(response.statusCode).json(response.toJSON());
});

router.get('/active', async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : null;
  const limit = req.query.limit ? parseInt(req.query.limit) : null;

  if ((page && page < 1) || (limit && limit < 1)) {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Page and limit must be positive numbers',
      data: null,
    });
  }

  const response = await getActiveRolesOnly(page, limit);
  return res.status(response.statusCode).json(response.toJSON());
});

module.exports = router;
