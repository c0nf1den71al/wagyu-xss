const router = require("express").Router();
const { processCommand } = require('../controllers/commandControllers');
const auth = require("../middlewares/authMiddleware");

router.post("/process", auth, processCommand);

module.exports = router;