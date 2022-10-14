const router = require("express").Router();
const { getAllUsers, deleteUserById, createUser, updateUserById } = require("../controllers/userControllers");
const auth = require("../middlewares/authMiddleware");
const adminAuth = require("../middlewares/adminAuthMiddleware");

router.get("/get", auth, getAllUsers);
router.post("/create", adminAuth, createUser);
router.post("/update/:id", adminAuth, updateUserById);
router.delete("/delete/:id", adminAuth, deleteUserById)
module.exports = router;