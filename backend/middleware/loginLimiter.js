const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //1min limit
    max: 5, //5 request limit
    message: {
        message:
            'too many attempts from this IP, please try later after 60 seconds',
    },
    handler: (req, res, next, options) => {
        logEvents(
            `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.header.origin}`,
            'errLog.log'
        )
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, //return rate limit info in the "RateLimit-*" headers
    legacyHeaders: false, //Disable the "X-RateLimit-* headers
})
module.exports = loginLimiter
