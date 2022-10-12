const router = require("express").Router();
const { createEvent } = require("../controllers/eventControllers");
const { getAllUsers, deleteUserById } = require("../controllers/userControllers");
const auth = require("../middlewares/authMiddleware");
 
router.get("/get", auth, getAllUsers)

module.exports = router;