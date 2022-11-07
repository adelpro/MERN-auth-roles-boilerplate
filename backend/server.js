const express = require('express')
require('dotenv').config()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsConfigs = require('./config/corsConfigs')
const allowedOrigins = require('./config/allowedOrigins')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const credentials = require('./middleware/credentials')

//const multer = require('multer')
const app = express()
const port = process.env.PORT || 3500
connectDB()
// socket
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: allowedOrigins } })
const users = []
io.on('connection', (socket) => {
  socket.on('setUserId', (userId) => {
    console.log('setUserId', userId)
    users[userId] = socket
  })
  socket.on('getNotifications', function (userId) {
    users[userId].emit('notifications', 'important notification message')
  })
  socket.on('disconnect', () => {})

  socket.on('message', (data) => {
    //sends the data to everyone except you.
    socket.broadcast.emit('response', data)

    //sends the data to everyone connected to the server
    // socket.emit("response", data)
  })
})

app.use(logger)
app.use(credentials)
app.use(cors(corsConfigs))
app.use(express.json())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, '/views')))
app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.all('*', require('./routes/404'))

app.use(errorHandler)

mongoose.connection.once('open', () => {
  server.listen(port, () => {
    console.log('Successfully Connected to MongoDB')
    console.log(`Application running on port: ${port}`)
  })
})
mongoose.connection.on('error', (err) => {
  console.log(err)
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}\t`,
    'mongoDBErrLog.log'
  )
})
