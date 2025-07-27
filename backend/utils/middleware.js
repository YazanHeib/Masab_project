const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function auth(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(403).send({ message: 'Access denied. Please check your API token' });
        try {
            const verified = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
            req.user = verified;

            // Optionally fetch user info if needed
            const user = await User.findById(req.user._id).select('username email');
            if (!user) return res.status(401).send({ message: 'User not found' });

            // No role check since single user app
            next();
        } catch (err) {
            res.status(401).send({ message: 'Invalid or expired auth token' });
        }
    } else {
        return res.status(401).json({ message: 'Malformed or unauthenticated auth token' });
    }
};
