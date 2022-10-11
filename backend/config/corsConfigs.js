const allowedOrigins = require("./allowedOrigins");

//const port = process.env.PORT || 3500;
const corsConfigs = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      //remove ||!origin to block postman request

      callback(null, true);
    } else {
      callback(new Error("origin not allowed by Cors"));
    }
  },
  //origin: [`http://localhost:${port}`, `https://localhost:${port}`],
  credentials: true,
  optionsSuccessStatus: 200,
};
module.exports = corsConfigs;
