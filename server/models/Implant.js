const mongoose = require("mongoose");
const { Schema } = mongoose;

const implantSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    server: {
        type: String,
        required: [true, "Implant must have a server"]
    },
    payload: {
        type: String,
        required: [true, "Implant must contain a payload"]
    },
    callbackInterval: {
        type: Number,
        default: 10000,
        required: false
    }
});

const Implant = mongoose.model("Implant", implantSchema);
module.exports = Implant;