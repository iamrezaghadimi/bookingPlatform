const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth")
const {upload, handleUpload, cleanupUserUploads} = require("../middlewares/upload")

// db link fixed. needed db auth.
// fixed schema = Joi.object(

router.post("/signup", usersController.signUp);
router.post("/signin", usersController.signIn);
router.post("/signout", auth(), usersController.signOut);
// router.patch("/me", auth(), usersController.updateUser);
// router.delete("/me", auth(), usersController.deleteUser);

router.patch("/me", auth(), upload, handleUpload, usersController.updateUser);
router.delete("/me", auth(), cleanupUserUploads, usersController.deleteUser);

module.exports = router;