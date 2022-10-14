const User = require('../models/User');
const { createEvent } = require('../controllers/eventControllers');
const bcrypt = require("bcryptjs");

module.exports.getAllUsers = async function (req, res){
    try {
        const users = await User.find().select("-password"); // Select removes the password hash from the response
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports.deleteUserById = async function(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        await createEvent("Team Server", `User ${user.username} was deleted`, 'warning');
        res.status(200).json({message: "User deleted"});
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports.createUser = async function(req, res) {
    try {
        const user = await User.create(req.body);
        await createEvent("Team Server", `User ${user.username} was created`, 'success');
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports.updateUserById = async function(req, res) {    
    try {
        if(req.body.password !== "") {
            const salt = await bcrypt.genSalt();
            req.body.password = await bcrypt.hash(req.body.password, salt);
            const user = await User.findByIdAndUpdate(req.params.id, req.body);
        } else {
            const data = { username: req.body.username, role: req.body.role };
            const user = await User.findByIdAndUpdate(req.params.id, data);
        }

        await createEvent("Team Server", `User ${user.username} was updated`, 'info');
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
}