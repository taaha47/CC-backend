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
        const token = req.get("authorization");
        if(token) {
            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                if(err)
                    res.status(401).json({});
                else {
                  req.user = decoded;
                  next();
                }
            });
        } else {
          return res.status(403).json({});
        }
    };
}

module.exports = JWTHelper;

