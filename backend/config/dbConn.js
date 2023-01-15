const mongoose = require('mongoose')

const mongoDB_url = process.env.MONGODB_ATLAS_URL

const connectDB = async () => {
  try {
    mongoose.connect(mongoDB_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  } catch (err) {
    console.log(err)
  }
}
module.exports = connectDB
