const jwt = require('jsonwebtoken');
const User = require('../models/User.js');  // Assuming you have a User model

// Middleware to check if the user is authenticated
const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization');
    console.log('Authorization header:', token);  // Log the header

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        // Decode the token and check for _id in the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        console.log('Decoded Token:', decoded); 
        const user = await User.findById(decoded.id);  // Use _id here, matching the token structure
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error);  // Log the error
        res.status(401).json({ error: 'Invalid or expired token', details: error.message });
    }
};


module.exports = {authenticateUser}