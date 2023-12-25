const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { URI, FRONTEND_URL } = require("./config/index");
const indexRouter = require("./routes/index");

const mongoDb = URI;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.listen(5005);

module.exports = app;
