const dotenv = require("dotenv");
dotenv.config();

const { URI } = process.env;

module.exports = { URI };
