const express = require("express");
const router = express.Router();
const path = require("path");
const { getAllEmployee, getEmployeeById, addEmployee, updateEmployee, deleteEmployee } = require("../controllers/employeeController");
const verifyJWT = require("../middleware/verifyJWT");
const ROLES_LIST = require("../config/roleList");
const verifyRoles = require("../middleware/verifyRoles");

router.route("/").get(getAllEmployee).post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), addEmployee);
router.route("/:id").get(getEmployeeById).put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee).delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), deleteEmployee);

module.exports = router;
