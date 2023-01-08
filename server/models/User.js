const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const sanitize = require("mongo-sanitize");

const userSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        required: [true, "Role is required"],
    },
    commandHistory: {
        type: Array,
        default: [],
    }
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.pre("update", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (username, password) {
    username = sanitize(username);
    password = sanitize(password);
    
    const user = await this.findOne({ username });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        return {error:"Username or password is incorrect."};
    }
    return {error:"Username or password is incorrect."};
};


const User = mongoose.model("User", userSchema);
module.exports = User;