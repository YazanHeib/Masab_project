const User = require('../models/User');
const express = require('express');
const verifyToken = require('../utils/middleware');
const router = express.Router();

router.get('/personal/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -__v');

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(200).send({
            user,
            message: 'User details retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).send({
            message: 'An error occurred while retrieving user details',
            error: error.message
        });
    }
});

router.get('/logout', async (req, res) => {
    try {
        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 0,
        });

        res.cookie('isLoggedIn', '', {
            httpOnly: false, // Client-side access is allowed for UI handling
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 0,
        });

        return res.status(200).send({
            status: 'success',
            message: 'Successfully logged out',
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).send({
            status: 'error',
            message: 'Internal server error while logging out',
        });
    }
});

module.exports = router;