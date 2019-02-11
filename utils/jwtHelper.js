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

    this.verifyJwt = async function (token) {
        return jwt.verify(token, process.env.SECRET);
    };
}

module.exports = JWTHelper;

