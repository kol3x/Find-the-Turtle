const dotenv = require("dotenv");
dotenv.config();

const { URI, FRONTEND_URL } = process.env;

module.exports = { URI, FRONTEND_URL };
