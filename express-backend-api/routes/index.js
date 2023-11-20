const express = require("express");
const router = express.Router();
const game_controller = require("../controllers/gameController");

router.get("/start", game_controller.start);

router.post("/turn", game_controller.turn);

router.get("/update", game_controller.updateChoices);

router.post("/add-record", game_controller.saveRecord);

router.get("/records", game_controller.allRecords);

module.exports = router;
