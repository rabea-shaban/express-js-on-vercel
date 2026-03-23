const router = require("express").Router();
const controller = require("../controllers/product.controller");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post(
  "/",
  upload.single("image"),
  auth,
  role("admin"),
  controller.create,
);
router.put(
  "/:id",
  auth,
  role("admin"),
  upload.single("image"),
  controller.update,
);

router.delete("/:id", auth, role("admin"), controller.deleteById);

module.exports = router;
