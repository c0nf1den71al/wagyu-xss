const mongoose = require("mongoose");
const { Schema } = mongoose;

const payloadSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        unique: true,
        required: [true, "Payload must have a name"]
    },
    description: {
        type: String,
        required: [true, "Payload must have a description"]
    },
    payload: {
        type: String,
        required: [true, "Payload must have a payload"]
    },
    compatibility: {
        type: String,
        required: [true, "Payload must have a compatibility"]
    },
    type: {
        type: String,
        required: [true, "Payload must have a type"],
        enum: ["Recon", "Lateral Movement", "Data Exfiltration", "Exploit", "Misc."]

    },
    author: {
        type: String,
        required: [true, "Payload must have an author"]
    }, 
    risk: {
        type: Number,
        required: [true, "Payload must have a risk"],
        min: 1,
        max: 5
    }
});

const Payload = mongoose.model("Payload", payloadSchema);
module.exports = Payload;