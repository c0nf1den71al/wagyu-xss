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
    lastCheckIn: {
        type: Date,
        default: Date.now,
    },
    queue: {
        type: Array,
        default: [],
        required: false
    }
});

const Host = mongoose.model("Host", hostSchema);
module.exports = Host;