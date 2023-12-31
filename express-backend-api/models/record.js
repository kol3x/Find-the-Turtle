const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecordSchema = new Schema({
  username: { type: String, required: true, maxLength: 100 },
  timer: { type: String, required: true, maxLength: 50 },
});

module.exports = mongoose.model("Record", RecordSchema);
