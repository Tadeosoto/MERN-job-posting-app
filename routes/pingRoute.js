const express = require("express");
const router = express.Router();
const { getPing } = require("../controllers/pingControllers");

router.get("/ping", getPing);
module.exports = router;
