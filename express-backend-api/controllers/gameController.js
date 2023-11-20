const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const { body, validationResult } = require("express-validator");

let startTime;
const choicesWithCoordinates = [
  { character: "Keysie and April <3", coordinates: [260, 765] },
  { character: "Mikey", coordinates: [892, 444] },
  { character: "Shreder", coordinates: [1564, 797] },
  { character: "Triceraton", coordinates: [374, 586] },
  { character: "Karai", coordinates: [1596, 502] },
];
let choices = [];

exports.start = asyncHandler(async (req, res, next) => {
  choices = [];
  // Set game start time for timer.
  startTime = Date.now();
  // fill choices with characters
  choicesWithCoordinates.forEach((choice) => {
    choices.push(choice.character);
  });

  res.send({
    choices,
  });
});

exports.updateChoices = asyncHandler(async (req, res, next) => {
  res.send({ choices });
});

exports.turn = asyncHandler(async (req, res, next) => {
  const choice = req.body.choice;
  const userCoordinates = req.body.coordinates.split(",");
  userCoordinates.forEach((value, index, array) => {
    array[index] = Number(value);
  });
  const character = choicesWithCoordinates.find(
    (el) => el.character === choice
  );
  const range = 100;
  if (
    Math.abs(userCoordinates[0] - character.coordinates[0]) <= range &&
    Math.abs(userCoordinates[1] - character.coordinates[1]) <= range &&
    choices.includes(choice)
  ) {
    choices = choices.filter((el) => el !== choice);
    if (choices.length === 0) {
      const timer = (Date.now() - startTime) / 1000;
      res.send({ gameIsOver: "You have won!", timer });
    } else {
      res.send({
        choices,
      });
    }
  } else {
    res.send({ missed: "Miss" });
  }
});

exports.saveRecord = [
  body("username").trim().isLength({ min: 1, max: 100 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("failed validation")
      return res.send(`FAILED. ERROR LOG: ${errors}`);
    }
    const record = new Record({
      username: req.body.username,
      timer: req.body.timer,
    });
    await record.save();
    console.log("saved");
    return res.status(200).send("Record saved");
  }),
];

exports.allRecords = asyncHandler(async (req, res, next) => {
  const records = await Record.find().exec();
  res.status(200).send(records);
})