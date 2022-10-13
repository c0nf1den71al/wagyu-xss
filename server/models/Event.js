const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: [true, "Event must have a creator"]
    },
    message: {
        type: String,
        required: [true, "Event must have a message"]
    },
    type: {
        type: String,
        required: [true, "Event must have a type"],
        enum: ["error", "warning", "info", "chat", "success"] // Type must be from this list
    }
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;