const express = require("express");
const router = express.Router();
const { handleLogout } = require("../controllers/authController");

router.route("/logout").post(handleLogout);

module.exports = router;
