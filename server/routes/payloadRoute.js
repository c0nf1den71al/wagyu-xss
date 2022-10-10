const router = require("express").Router();
const { getAllPayloads } = require("../controllers/payloadControllers");
const auth = require("../middlewares/authMiddleware");

router.get("/get", auth, getAllPayloads);

module.exports = router;