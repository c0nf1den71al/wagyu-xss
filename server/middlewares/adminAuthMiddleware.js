const jwt = require('jsonwebtoken');
// Make me so I also check the userID
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                    res.status(401).json({
                        error: 'Unauthorized'
                    });
                } else {
                    if(decodedToken.role === 'Admin') {
                        next();
                    } else {
                        res.status(401).json({
                            error: 'Unauthorized'
                        });
                    }
                }
            });
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    } catch {
        res.status(401).json({
            error: 'Unauthorized'
        });
    }
}