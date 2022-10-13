const User = require('../models/User');
const { createEvent } = require('../controllers/eventControllers');

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