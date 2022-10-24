const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 60 * 60 * 24 // 1 day
const createToken = (id, username, role) => {
    return jwt.sign({ id, username, role }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        if (user.error) {
            res.status(401).json({
                error: user.error
            });
        } else {
            const token = createToken(user._id, user.username, user.role);
            res.status(200).json({
                id: user._id,
                username: user.username,
                role: user.role,
                jwt: token
            });
        }
    } catch (err) {
        res.status(400).json({ error: "An error occured." });
    }
}

module.exports.verifyJwt = async (req, res) => {
    try {
        const decoded = jwt.verify(req.body.jwt, process.env.TOKEN_SECRET)
        const user = await User.findOne({
            username: decoded.username
        });

        if (user) {
            res.status(200).json({
                username: user.username,
            });
        } else {
            res.status(401).json({
                message: "JWT Invalid."
            });
        }

    } catch (err) {
        res.status(401).json({
            message: "JWT Invalid."
        });

    }
}