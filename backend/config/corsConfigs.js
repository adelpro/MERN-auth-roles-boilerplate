const allowedOrigins = require("./allowedOrigins");
const corsConfigs = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      //remove ||!origin to block postman request
      callback(null, true);
    } else {
      callback(new Error("origin not allowed by Cors"));
    }
  },
  Credentials: true,
  optionsSuccesStatus: 200,
};
module.exports = corsConfigs;
