const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const sequelize = require("./config/db");
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("OK!");
});

app.use("/api/products", require("./routes/productApiRoutes"));

sequelize
  // .sync({ force: true })
  .sync()
  .then((res) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
