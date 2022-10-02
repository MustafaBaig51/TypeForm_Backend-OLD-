const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/User.model');
const { authSchema } = require('../helpers/validation_schema');
const { signAccessToken } = require('../helpers/jwt_helper');

router.post('/register', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);
        const { email, password } = result;

        const doesExist = await User.findOne({ email: email });
        if (doesExist) throw createError.Conflict(`${email} is already registered.`);

        const user = new User(result);
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id);

        // res.send(savedUser);
        res.send({ accessToken });
    }
    catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);
        const { email, password } = result;

        const user = await User.findOne({ email });
        if (!user) throw createError.NotFound("User not registered.");

        const isMatched = await user.isValidPassword(password);
        if (!isMatched) throw createError.Unauthorized("email/password not valid.")

        const accessToken = await signAccessToken(user.id);
        res.send({ accessToken });
    }
    catch (error) {
        if (error.isJoi === true) return next(createError.BadRequest("Invalid email/password."))
        next(error);
    }
});

router.post('/refresh-token', async (req, res, next) => {
    res.send('Refresh Token Route');
});

router.delete('/logout', async (req, res, next) => {
    res.send('Logout Route');
});

module.exports = router;