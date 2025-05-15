const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// db link fixed. needed db auth.
// fixed schema = Joi.object(

router.post("/signup", usersController.signUp);
router.post("/signin", usersController.signIn);
// router.post("/signout", usersController.signOut);
// router.patch("/me", usersController.updateUser);
// router.delete("/me", usersController.deleteUser);
module.exports = router;