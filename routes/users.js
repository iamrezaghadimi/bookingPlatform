const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth")

// db link fixed. needed db auth.
// fixed schema = Joi.object(

router.post("/signup", usersController.signUp);
router.post("/signin", usersController.signIn);
router.post("/signout", auth(), usersController.signOut);
router.patch("/me", auth(), usersController.updateUser);
router.delete("/me", auth(), usersController.deleteUser);

module.exports = router;