const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, require: true },
    title: { type: String, require: true },
    type: { type: Number, required: true },
    text: { type: String, require: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)
module.exports = mongoose.model('notification', notificationSchema)
