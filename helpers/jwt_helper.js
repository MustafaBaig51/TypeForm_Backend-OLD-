const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { reject } = require('firebase-tools/lib/utils');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((ressolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "1h",
                issuer: "www.typeform.com",
                audience: userId
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    // reject(err);
                    reject(createError.InternalServerError());
                }
                ressolve(token);
            });
        });
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return next(createError.Unauthorized());
            }
            req.payload = payload;
            next();
        });
    }
};