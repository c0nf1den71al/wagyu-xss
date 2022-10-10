const Payload = require("../models/Payload");

module.exports.getAllPayloads = async (req, res) => {
    try {
        const payloads = await Payload.find({});
        res.status(200).json(payloads);
    } catch (err) {
        const errors = handle(err)
        res.status(400).json({ errors });
    }
}

module.exports.getPayloadByName = async (payloadName) => {
    try {
        const payload = await Payload.findOne({ name: payloadName });
        return payload
    } catch (err) {
        console.log(err)
        return err
    }
}