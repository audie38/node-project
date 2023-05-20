const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("user", {
  userId: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = User;
