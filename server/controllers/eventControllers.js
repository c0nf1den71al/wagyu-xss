const Event = require("../models/Event");

module.exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (err) {
        const errors = handle(err)
        res.status(400).json({ errors });
    }
}

module.exports.createEvent = async (createdBy, message, type) => {
    try {
        const event = await Event.create({
            createdBy,
            message,
            type
        });
        return event;
    } catch (err) {
        return { err };
    }
}

module.exports.exportEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (err) {
        res.status(400).json({ errors });
    }
}
