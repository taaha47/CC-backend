const jwt = require('jsonwebtoken');

function JWTHelper() {
    this.generateJwt = function (payload) {
        return (
            jwt.sign({
                ...payload
            }, process.env.SECRET, {
                expiresIn: process.env.EXP
            })
        );
    };

    this.checkToken = function (req, res, next) {
        const token = req.headers["authorization"];
        if(token) {
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if(err)
                    return res.status(401).json({});
                next();
            });
        }
        return res.status(403).json({});
    };
}

module.exports = JWTHelper;

