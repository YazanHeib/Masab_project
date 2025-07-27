const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

const authConfig = {
  accessTokenExpireTime: '1d',
  refreshTokenExpireTime: '30d',
};

let refreshTokens = [];

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('-__v');
    if (!user) {
      return res.status(400).json({ message: 'Email is not registered' });
    }

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Email or password is incorrect' });
    }

    // JWT payload
    const payload = { _id: user._id };

    // Generate tokens
    const accessToken = jwt.sign(payload, process.env.AUTH_TOKEN_SECRET, {
      expiresIn: authConfig.accessTokenExpireTime,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: authConfig.refreshTokenExpireTime,
    });

    refreshTokens.push(refreshToken); // For demo: store in memory

    // Exclude password from response
    const userResponse = { ...user._doc };
    delete userResponse.password;

    // Set tokens as HttpOnly cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
    };

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.cookie('isLoggedIn', true, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Return response
    return res.status(200).json({
      message: 'Login successful',
      userData: userResponse,
      accessToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
