const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, username, role) => {
    return jwt.sign({ id, username, role }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id, user.username, user.role);
        res.status(200).json({
            id: user._id,
            username: user.username,
            role: user.role,
            jwt: token
        });
    } catch (err) {
        res.status(400).json({ err });
    }
}