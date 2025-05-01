const express = require("express");
const router = express.Router();
const flightsController = require("../controllers/usersController");

router.post("/signup", usersController.signUp);
router.post("/signin", usersController.signIn);
router.post("/signout", usersController.signOut);
router.patch("/me", usersController.updateUser);
router.delete("/me", usersController.deleteUser);
module.exports = router;