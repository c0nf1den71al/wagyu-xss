const router = require("express").Router();
const { getAllPayloads, createPayload, updatePayloadById, deletePayloadById } = require("../controllers/payloadControllers");
const auth = require("../middlewares/authMiddleware");

router.get("/get", auth, getAllPayloads);
router.post("/create", auth, createPayload);
router.post("/update/:id", auth, updatePayloadById);
router.delete("/delete/:id", auth, deletePayloadById);
module.exports = router;