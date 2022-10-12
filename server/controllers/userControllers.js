const User = require('../models/User');

module.exports.getAllUsers = async function (req, res){
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports.deleteUserById = async function(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
}