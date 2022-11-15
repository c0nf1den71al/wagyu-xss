const Payload = require("../models/Payload");
const { createEvent } = require("../controllers/eventControllers");

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

module.exports.getPayloadById = async (payloadId) => {
    try {
        const payload = await Payload.findById(payloadId);
        return payload
    } catch (err) {
        console.log(err)
        return err
    }
}

module.exports.createPayload = async (req, res) => {
    try {
        const payload = await Payload.create(req.body);
        await createEvent("Team Server", `Payload ${payload.name} was created`, 'success');
        res.status(201).json(payload);
    } catch (err) {
        res.status(400).json({ err });
    }
}

module.exports.updatePayloadById = async function(req, res) {    
    try {
        const payload = await Payload.findByIdAndUpdate(req.params.id, req.body);
        await createEvent("Team Server", `Payload ${payload.name} was updated`, 'info');
        res.status(200).json(payload);
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports.deletePayloadById = async function(req, res) {
    try {
        const payload = await Payload.findByIdAndDelete(req.params.id);
        await createEvent("Team Server", `Payload ${payload.name} was deleted`, 'warning');
        res.status(200).json({message: "Payload deleted"});
    } catch (err) {
        res.status(400).json(err);
    }
}