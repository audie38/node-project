const Product = require("../model/product");

const getProducts = async (req, res) => {
  try {
    const query = req.query;
    let response = await Product.findAll();
    if (query) {
      response = await Product.findAll({ where: query });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getProductById = async (req, res) => {
  try {
    const response = await Product.findByPk(req.params.id);
    if (response === null) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const addProduct = async (req, res) => {
  const { title, price, imageUrl, description } = req.body;
  try {
    const response = await Product.create({
      title,
      price,
      imageUrl,
      description,
    });
    return res.status(201).json({ data: response });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const updateProduct = async (req, res) => {
  const { title, price, imageUrl, description } = req.body;
  try {
    const product = await Product.findByPk(req.params.id);
    if (product === null) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    (product.title = title), (product.price = price), (product.imageUrl = imageUrl), (product.description = description);
    await product.save();
    return res.status(200).json({ message: "Product Updated" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product === null) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    await product.destroy();
    return res.status(200).json({ message: "Product Deleted" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
