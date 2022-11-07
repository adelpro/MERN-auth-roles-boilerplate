const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (err) {
        console.log(err)
    }
}
module.exports = connectDB
