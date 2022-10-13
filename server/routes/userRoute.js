const router = require("express").Router();
const { getAllUsers, deleteUserById, createUser } = require("../controllers/userControllers");
const auth = require("../middlewares/authMiddleware");
const adminAuth = require("../middlewares/adminAuthMiddleware");

router.get("/get", auth, getAllUsers);
router.post("/create", adminAuth, createUser);
router.delete("/delete/:id", adminAuth, deleteUserById)
module.exports = router;