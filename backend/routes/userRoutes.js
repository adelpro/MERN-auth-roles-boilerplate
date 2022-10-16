const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
router.route("/").post(userController.createNewUser);
router.use(verifyJWT);
router
  .route("/")
  .get(userController.getAllUsers)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router.route("/one").post(userController.getOneUser);
module.exports = router;
