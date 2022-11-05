const mongoose = require('mongoose')

<<<<<<< HEAD
const connectDB = () => {
  try {
    mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
=======
const connectDB = async () => {
    try {
        mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}
module.exports = connectDB
>>>>>>> v4.0.6
