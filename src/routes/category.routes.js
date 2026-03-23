const router = require("express").Router();
const controller = require("../controllers/category.controller");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const { createCategorySchema } = require("../validators/category.validation");

router.get("/", controller.getAll);
router.get("/:id", controller.getByID);
router.post(
  "/",
  auth,
  role("admin"),
  upload.single("image"),
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
