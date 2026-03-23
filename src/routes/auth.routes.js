const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", auth, controller.getProfile);
router.put("/profile", auth, controller.updateProfile);

module.exports = router;
