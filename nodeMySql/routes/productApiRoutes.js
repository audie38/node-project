const express = require("express");
const router = express.Router();

const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require("../controller/productController");

router.route("/").get(getProducts).post(addProduct);
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
