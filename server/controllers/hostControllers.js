const Host = require("../models/Host");
const { getPayloadByName } = require("./payloadControllers");

module.exports.registerHost = async (req, res) => {
    try {
        const host = await Host.create(req.body);
        res.status(200).json({
            id: host._id.toString(),
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

module.exports.getAllHosts = async function (req, res){
    try {
        const hosts = await Host.find();
        res.status(200).json(hosts);
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports.addPayloadToQueue = async function (payloadName, hostId, username){
    try {
        let payload = {}
        payload.name = payloadName;
        payload.script = await getPayloadByName(payloadName);
        payload.script = payload.script.payload;
        payload.author = username;
        // Add collision detection
        payload.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const host = await Host.findById(hostId);
        host.queue.push(payload);
        await host.save();
    } catch (err) {
        console.log(err);
    }
};

module.exports.checkIn = async function (hostId){
    try {
        const host = await Host.findById(hostId);
        host.lastCheckIn = Date.now();
        await host.save();
    } catch (err) {
        console.log(err);
    }
}