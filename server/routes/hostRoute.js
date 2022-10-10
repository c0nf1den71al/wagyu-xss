const router = require("express").Router();
const { createEvent } = require("../controllers/eventControllers");
const { registerHost, getAllHosts } = require("../controllers/hostControllers");
const auth = require("../middlewares/authMiddleware");
 
router.post("/register", registerHost)

router.get("/api/v1/hosts/get", auth, getAllHosts)

module.exports = router;