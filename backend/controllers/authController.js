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
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser || !foundUser.active) {
    res.status(401).json({ message: "Unauthorized r24157" });
  }
  const matchPassword = await bcrypt.compare(password, foundUser.password);
  if (!matchPassword) {
    res.status(401).json({ message: "Unauthorized r97452" });
  }
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        id: foundUser.id,
        roles: foundUser.roles,
      },
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
    httpOnly: true,
    SameSite: "None",
    secure: process.env.NODE_ENV === "production", //-only for server with https
    maxAge: 24 * 60 * 60 * 1000,
  });
  //then send access token with username and roles
  res.json({ accessToken });
});

// @desc Refresh
// @Route get /auth/refresh
// @Access Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized r65472" });
  }

  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden r74690" });
      }
      const foundUser = await User.findOne(decoded.username).exec();
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized r68457" });
      }
      const accessToken = jwt.sign(
        { UserInfo: { username: foundUser.username, roles: foundUser.roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      //Send accessToken with username and roles
      res.json({ accessToken });
    })
  );
});

// @desc Logout
// @Route POST /auth/logout
// @Access Public
const logout = asyncHandler(async (req, res) => {
  const cookies = req?.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content
  }
<<<<<<< HEAD
  res.clearCookie("jwt", {
    httpOnly: true,
    SamSite: "None",
    secure: process.env.NODE_ENV === "production", // - only server with https
  });
=======
  res.clearCookie("jwt", { httpOnly: true, samSite: "None", secure: true });
>>>>>>> b572c022652c61bc3d385e172040ca766474fafc
  res.json({ message: "Logged out successfully" });
});

module.exports = { login, refresh, logout };
