const { logEvents } = require('./logger')
const errorHandler = (err, req, res) => {
  const message = `${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers?.origin}`
  logEvents(message, 'errLog.log')
  console.log(err.stack)
  const status = res.statusCode ? res.statusCode : 500 //serveur error code
  res.status(status)
  res.json({ message: err.message })
}
module.exports = errorHandler
