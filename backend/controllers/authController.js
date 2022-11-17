const bcrypt = require('bcrypt')
const User = require('../models/user')
const notification = require('../models/notification')
const jwt = require('jsonwebtoken')

// @desc Login
// @Route POST /auth
// @Access Public
const login = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  const foundUser = await User.findOne({ username }).exec()
  if (!foundUser || !foundUser.active) {
    res.status(401).json({ message: 'Unauthorized r24157' })
  }
  const matchPassword = await bcrypt.compare(password, foundUser.password)
  if (!matchPassword) {
    res.status(401).json({ message: 'Unauthorized r97452' })
  }
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        id: foundUser._id,
        roles: foundUser.roles,
        profileImage: foundUser.profileImage,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30s' }
  )
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        id: foundUser._id,
        roles: foundUser.roles,
        profileImage: foundUser.profileImage,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )

  //Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    SameSite: 'None',
    secure: process.env.NODE_ENV === 'production', //-only for server with https
    maxAge: 24 * 60 * 60 * 1000,
  })

  //then send access token with username and roles
  res.json({ accessToken })

  // add notification for login
  await notification.create({
    user: foundUser._id,
    title: 'login',
    type: 1,
    text: `New login at ${new Date()}`,
    read: false,
  })
}

// @desc Refresh
// @Route get /auth/refresh
// @Access Public
const refresh = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Unauthorized r65472' })
  }

  const refreshToken = cookies.jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden r74690' })
      }
      const foundUser = await User.findOne(decoded.username).exec()
      if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized r68457' })
      }
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            id: foundUser._id,
            roles: foundUser.roles,
            profileImage: foundUser.profileImage,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
      )
      //Send accessToken with username and roles
      res.json({ accessToken })
    }
  )
}

// @desc Logout
// @Route POST /auth/logout
// @Access Public
const logout = async (req, res) => {
  const cookies = req?.cookies
  if (!cookies?.jwt) {
    return res.sendStatus(204) //No content
  }
  res.clearCookie('jwt', { httpOnly: true, samSite: 'None', secure: true })
}

module.exports = { login, refresh, logout }
