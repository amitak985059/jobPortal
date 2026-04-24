const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');

// Middleware: verify JWT token from Authorization header or cookie
const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies.authToken;
        
        // Also support Bearer token in header (for API clients)
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }

        if (!token) {
            return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
};

module.exports = { authMiddleware };
