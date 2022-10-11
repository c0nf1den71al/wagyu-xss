const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { getAllFindings, deleteFindingById } = require("../controllers/findingControllers");

router.get("/get", auth, getAllFindings)

router.delete("/delete/:id", auth, deleteFindingById)

module.exports = router;