const router = require("express").Router();
const {
  createRole,
  getRole,
  updateRole,
  deleteRole,
  getAllRoles,
} = require("../service/role");

router.post("/", async (req, res) => {
  const { name, permissions, createdBy } = req.body;
  return await createRole(name, permissions, createdBy);
});

router.get("/:id", async (req, res) => {
  return await getRole(parseInt(req.params.id));
});

router.put("/:id", async (req, res) => {
  return await updateRole(parseInt(req.params.id), req.body);
});

router.delete("/:id", async (req, res) => {
  return await deleteRole(parseInt(req.params.id));
});

router.get("/", async (req, res) => {
  return await getAllRoles();
});

module.exports = router;
