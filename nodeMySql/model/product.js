const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const User = require("./user");

const Product = sequelize.define("product", {
  productId: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE", foreignKey: "userId", targetKey: "userId" });
User.hasMany(Product, { foreignKey: "userId", sourceKey: "userId" });

module.exports = Product;
