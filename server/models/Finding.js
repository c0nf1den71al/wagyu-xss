const mongoose = require("mongoose");
const { Schema } = mongoose;

const findingSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: [true, "Finding must have a name"]
    },
    createdBy: {
        type: String,
        required: [true, "Finding must have a creator"]
    },
    hostId: {
        type: String,
        required: [true, "Finding must have an associated host"]
    },
    value: {
        type: String,
        required: [true, "Finding must have a value"]
    },
    type: {
        type: String,
        required: [true, "Finding must have a type"],
        enum: ["text", "image"]
    }
});

const Finding = mongoose.model("Finding", findingSchema);
module.exports = Finding;