const router = require("express").Router();
const { getAllEvents, createEvent, exportEvents } = require("../controllers/eventControllers");
const auth = require("../middlewares/authMiddleware");

router.get("/get", auth, getAllEvents);

router.post("/create", auth, async (req, res) => {
    const { createdBy, message, type } = req.body;
    const event = await createEvent(createdBy, message, type);
    return res.status(200).json(event);
});

router.get("/export", auth, exportEvents);

module.exports = router;