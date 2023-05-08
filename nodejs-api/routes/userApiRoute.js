const express = require("express");
const router = express.Router();
const { registerNewUser, handleUserLogin, getAllUsers, getUser, updateUser, deleteUser, setUserAdmin, setUserEditor } = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).put(verifyJWT, updateUser).delete(deleteUser);
router.route("/admin-registration/:id").put(verifyJWT, setUserAdmin);
router.route("/editor-registration/:id").put(verifyJWT, setUserEditor);
router.route("/register").post(registerNewUser);
router.route("/login").post(handleUserLogin);

module.exports = router;
