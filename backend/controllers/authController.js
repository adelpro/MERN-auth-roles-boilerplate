const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// @desc Login
// @Route POST /auth
// @Access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All field are required" });
  }
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser || !foundUser.active) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const matchPassword = await bcrypt.compare(password, foundUser.password);
  if (!matchPassword) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const accessToken = jwt.sign(
    {
      UserInfo: { username: foundUser.username, roles: foundUser.roles },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" }
  );
  const refreshToken = jwt.sign(
    {
      UserInfo: { username: foundUser.username },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  //Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https only
    sameSite: "None", //cross -site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //7d
  });
  //then send access token wit username and roles
  res.json({ accessToken });
});

// @desc Refresh
// @Route get /auth/refresh
// @Access Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const foundUser = await User.findOne(decoded.username).exec();
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const accessToken = jwt.sign(
        { UserInfo: { username: foundUser.username, roles: foundUser.roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      console.log("token refreched");
      res.json({ accessToken });
    })
  );
});

// @desc Logout
// @Route POST /auth/logout
// @Access Public
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content
  }
  res.clearCookie("jwt", { httpOnly: true, samSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
});

module.exports = { login, refresh, logout };
