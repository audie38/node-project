const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  const jwtToken = req.headers.authorization || req.headers.Authorization;
  if (!cookies?.jwt && !jwtToken) {
    return res.sendStatus(204);
  }

  const token = jwtToken.split(" ")[1];

  const userExists = await User.findOne({ refreshToken: token });

  if (!userExists) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  userExists.refreshToken = "";
  const result = await userExists.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //Secure true - only serves on https
  res.sendStatus(204);
};

module.exports = {
  handleLogout,
};
