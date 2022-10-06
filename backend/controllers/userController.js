const user = require("../models/user");
const note = require("../models/note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @Route GET /users
// @Access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await user.find().select("-password").lean();
  if (!users) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Create new users
// @Route POST /users
// @Access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, email, roles } = req.body;
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
      .json({ message: "Verify your data and proceed again" });
  }
  // Check for duplicate
  const duplicate = await user.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "user already exist" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  //create new user
  const newUser = await user.create({
    username,
    password: hashedPassword,
    email,
    roles,
  });
  if (newUser) {
    res.json({ message: `new user ${username} created with success` });
  } else {
    res.status(400).json({
      message: "user creation failed, please verify your data and try again",
    });
  }
});

// @desc Update a users
// @Route PATCH /users
// @Private access
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;
  //Confirm data
  console.log(req.body);
  console.log(
    !username,
    !password,
    password.length < 5,
    !Array.isArray(roles),
    !roles.length,
    typeof active !== "boolean"
  );

  if (
    !username ||
    !password ||
    password.length < 5 ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== Boolean
  ) {
    return res
      .status(400)
      .json({ message: "Verify your data and proceed again" });
  }
  // Check for duplicate
  const updateUser = await user.findById(id).exec();
  if (!updateUser) {
    return res
      .status(400)
      .json({ message: `Can't find a user with this id: ${id}` });
  }
  // Check for duplicate
  const duplicate = await user.findOne({ username }).lean().exec();
  //Allow update to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({
      message: `user with the same username: ${username} exists already`,
    });
  }
  updateUser.username = username;
  updateUser.roles = roles;
  updateUser.active = active;
  updateUser.password = await bcrypt.hash(password, 10);
  const save = await updateUser.save();
  res.json({ message: `User: ${username} updated with success` });
});

// @desc delete a users
// @Route DELETE /users
// @Private access
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: `Can't find a user with this id: ${id}` });
  }
  const notes = await note.findOne({ user: id }).lean().exec();
  if (notes?.length) {
    return res
      .status(400)
      .json({ message: `User with id: ${id} has assigned notes` });
  }
  const deleteUser = await user.findById(id).exec();
  if (!deleteUser) {
    return res
      .status(400)
      .json({ message: `Can't find a user with id: ${id}` });
  }
  const result = await deleteUser.deleteOne();
  if (!result) {
    return res
      .status(400)
      .json({ message: `Can't delete the user with id: ${id}` });
  }
  res.json({ message: `User with id: ${id} deleted with success` });
});
module.exports = { createNewUser, updateUser, getAllUsers, deleteUser };
