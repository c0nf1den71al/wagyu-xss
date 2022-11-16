const router = require("express").Router();
const { registerHost, getAllHosts, markHostAsOffline } = require("../controllers/hostControllers");
const auth = require("../middlewares/authMiddleware");
 
router.post("/register", registerHost)

router.get("/api/v1/hosts/get", auth, getAllHosts)
router.post("/api/v1/hosts/markAsOffline/:id", auth, markHostAsOffline)

module.exports = router;