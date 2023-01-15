const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')
const multer = require('multer')

const { v4: uuid } = require('uuid')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/')
  },
  filename: (req, file, cb) => {
    const fileName =
      'profileimage' +
      uuid().toString() +
      '_' +
      file.originalname.toLowerCase().split(' ').join('-')
    cb(null, fileName)
  },
})


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype == 'image/jpg'
  ) {
    cb(null, true)
  } else {
    cb('Only .png, .jpg and .jpeg image format allowed!', false)
  }
}


const upload = multer({ storage, fileFilter, limits: 1024 * 1024 * 5 })

router.route('/').post(userController.createNewUser)
router.use(verifyJWT)
router
  .route('/')
  .get(userController.getAllUsers)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
router.route('/one').post(userController.getOneUser)
router
  .route('/image')
  .post(upload.single('image'), userController.updateUserImage)
module.exports = router
