const router = require("express").Router();
const {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
  getAllPermissions,
} = require("../service/permission");

router.post("/", async (req, res) => {
  const { name, api, createdBy } = req.body;
  return await createPermission(name, api, createdBy);
});

router.get("/:id", async (req, res) => {
  return await getPermission(parseInt(req.params.id));
});

router.put("/:id", async (req, res) => {
  return await updatePermission(parseInt(req.params.id), req.body);
});

router.delete("/:id", async (req, res) => {
  return await deletePermission(parseInt(req.params.id));
});

router.get("/", async (req, res) => {
  return await getAllPermissions();
});

module.exports = router;
