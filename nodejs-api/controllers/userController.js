const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res.status(204).json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res.status(204).json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(user);
};

const updateUser = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res.status(204).json({ message: `User ID ${req.params.id} not found` });
  }
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); //encrypt password
  user.password = hashedPassword;

  try {
    const result = await user.save();
    return res.status(200).json({ message: "Password Updated Successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const setUserAdmin = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res.status(204).json({ message: `User ID ${req.params.id} not found` });
  }

  user.roles.Admin = 5150;

  try {
    const result = await user.save();
    return res.status(200).json({ message: "Admin Registration Success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const setUserEditor = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res.status(204).json({ message: `User ID ${req.params.id} not found` });
  }

  user.roles.Editor = 1984;

  try {
    const result = await user.save();
    return res.status(200).json({ message: "Editor Registration Success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const registerNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password Required" });
  }

  const duplicate = await User.findOne({ username: username });
  if (duplicate) {
    return res.status(409).json({ message: `Username already exists` });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); //encrypt password

    const result = await User.create({
      username: username,
      password: hashedPassword,
    });

    res.status(201).json({ status: "201", message: "New User Created!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleUserLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password Required" });
  }

  const userExists = await User.findOne({ username: username });
  if (!userExists) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const credentialsMatch = await bcrypt.compare(password, userExists.password);
  if (credentialsMatch) {
    const roles = Object.values(userExists.roles).filter(Boolean);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: userExists.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );
    const refreshToken = jwt.sign({ username: userExists.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

    userExists.refreshToken = accessToken;
    const result = await userExists.save();

    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 }); //Set Cookie to last 1 Day
    return res.status(200).json({ roles, accessToken });
  } else {
    return res.status(401).json({ message: "Invalid Credentials" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
  registerNewUser,
  handleUserLogin,
  setUserAdmin,
  setUserEditor,
};
