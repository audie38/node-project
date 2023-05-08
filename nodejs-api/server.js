const express = require("express");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const app = express();
const connectDB = require("./config/db");

connectDB();
app.use(logger); //custom middleware logger
app.use(credentials); //custom middleware handle Credentials Middleware for CORS

app.use(cors(corsOptions)); //Cross Origin Resource Sharing Middleware

app.use(express.urlencoded({ extended: false })); //get form data
app.use(express.json()); //get json data
app.use(cookieParser()); //middleware for cookies
app.use("/", express.static(path.join(__dirname, "/public"))); //set static path

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/api/user", require("./routes/userApiRoute"));
app.use("/api/auth", require("./routes/authApiRoute"));
app.use("/api/employee", require("./routes/employeeApiRoute"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else {
    res.json({ message: "404 Not Found" });
  }
});

app.use(errorHandler); //custom middleware error handler

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
