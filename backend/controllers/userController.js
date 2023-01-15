const user = require('../models/user')
const note = require('../models/note')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const notification = require('../models/notification')
const validator = require('validator');

// @desc Get all users
// @Route GET /users
// @Access Private
const getAllUsers = async (req, res) => {
  const users = await user.find().select('-password').lean().exec()
  if (!users) {
    return res.status(400).json({ message: 'No users found' })
  }
  res.json(users)
}
// @desc Get one user by ID
// @Route POST /users/one
// @Access Private
const getOneUser = async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res
      .status(400)
      .json({ message: 'Verify your data and proceed again r35476' })
  }
  // Check if the note exist
  const oneUser = await user.findById(id).lean().exec()
  if (!oneUser) {
    return res
      .status(400)
      .json({ message: `Can't find a user with this id: ${id}` })
  }
  res.json(oneUser)
}

// @desc Create new user
// @Route POST /users
// @Access Private
const createNewUser = async (req, res) => {
  const { username, password, email, roles } = req.body
  //Confirm data
  if (
    !username ||
    username.length < 4 ||
    !password ||
    password.length < 6 ||
    !email ||
    !Array.isArray(roles) ||
    !roles.length
  ) {
    return res
      .status(400)
      .json({ message: 'Verify your data and proceed again' })
  }
 
  //check for email validity
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'please enter a valid email address'})
  }


  // Check for duplicate
  const duplicate = await user.findOne({ username }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'user already exist' })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  //create new user
  const newUser = await user.create({
    username,
    password: hashedPassword,
    email,
    roles,
  })
  if (newUser) {
    res.json({ message: `new user ${username} created with success` })
  } else {
    res.status(400).json({
      message: 'user creation failed, please verify your data and try again',
    })
  }
}

// @desc Update a user
// @Route PATCH /users
// @Private access
const updateUser = async (req, res) => {
  const { id, username, password, roles, active } = req.body
  //Confirm data
  if (
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res
      .status(400)
      .json({ message: 'Verify your data and proceed again r98451' })
  }
  // Check for duplicate
  const updateUser = await user.findById(id).exec()
  if (!updateUser) {
    return res
      .status(400)
      .json({ message: `Can't find a user with this id: ${id}` })
  }
  // Check for duplicate
  const duplicate = await user.findOne({ username }).lean().exec()
  //Allow update to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({
      message: `user with the same username: ${username} exists already`,
    })
  }
  updateUser.username = username
  updateUser.roles = roles
  updateUser.active = active
  if (password) {
    updateUser.password = await bcrypt.hash(password, 10)
  }
  await updateUser.save()
  res.json({ message: `User: ${username} updated with success` })
}

// @desc delete a user
// @Route DELETE /users
// @Private access
const deleteUser = async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res
      .status(400)
      .json({ message: `Can't find a user with this id: ${id}` })
  }
  const notes = await note.findOne({ user: id }).lean().exec()
  if (notes?.length) {
    return res
      .status(400)
      .json({ message: `User with id: ${id} has assigned notes` })
  }
  const deleteUser = await user.findById(id).exec()
  if (!deleteUser) {
    return res.status(400).json({ message: `Can't find a user with id: ${id}` })
  }
  const result = await deleteUser.deleteOne()
  if (!result) {
    return res
      .status(400)
      .json({ message: `Can't delete the user with id: ${id}` })
  }
  res.json({ message: `User with id: ${id} deleted with success` })
}

// @desc Update a user image
// @Route POST /users
// @Private access
const updateUserImage = async (req, res) => {
  const fileName = req.file.filename
  // Adding image to mongodb
  const { id } = req.body
  if (!id) {
    return res
      .status(400)
      .json({ message: `Can't find a user with this id: ${id}` })
  }
  const updateUser = await user.findById(id).exec()
  if (updateUser?.length) {
    return res
      .status(400)
      .json({ message: `Can't find a user with this id: ${id}` })
  }
  // Remove old photo
  if (updateUser.profileImage) {
    const oldPath = path.join(__dirname, '..', updateUser.profileImage)
    fs.access(oldPath, (err) => {
      if (err) {
        return
      }
      fs.rmSync(oldPath, {
        force: true,
      })
    })
  }
  // adding new photo to mongoDB
  updateUser.profileImage = '/images/' + fileName
  await updateUser.save()

  // add notification for updated profile image
  await notification.create({
    user: id,
    title: 'updated profile image',
    type: 1,
    text: `Profile image updated at ${new Date()}`,
    read: false,
  })
  res.json({ message: 'image uploaded wtih success' })
}
module.exports = {
  createNewUser,
  updateUser,
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUserImage,
}
