require('dotenv').config()
require('express-async-errors')
const express = require('express')
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
const app = express()
const port = process.env.PORT || 3500
connectDB()

app.use(logger)
app.use(credentials)
app.use(cors(corsConfigs))
app.use(express.json())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, '/views')))
app.use('/images', express.static('images'))
app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.all('*', require('./routes/404'))

app.use(errorHandler)
// socket
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: allowedOrigins } })
require('./socketio.js')(io)
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
