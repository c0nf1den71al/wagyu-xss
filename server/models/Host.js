const mongoose = require("mongoose");
const { Schema } = mongoose;

const hostSchema = new Schema({
    externalIP: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    currentTab: {
        type: String,
    },
    associatedImplant: {
        type: String,
        required: true,
    },
    lastCheckIn: {
        type: Date,
        default: Date.now,
    },
    offlineAfter: {
        type: Number,
        default: 360,
        required: false
    },
    queue: {
        type: Array,
        default: [],
        required: false
    }
});

const Host = mongoose.model("Host", hostSchema);
module.exports = Host;