const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You need to set GOOGLE_APPLICATION_CREDENTIALS in .env or provide serviceAccount key
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // MOCK AUTH: Skip firebase verification for simulation
            // const decodedToken = await admin.auth().verifyIdToken(token);

            // Just assume valid if token is there
            req.user = { uid: 'mock_uid', email: 'mock@example.com' };

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const protectAdmin = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify JWT (using secret from env or dev default)
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_dev_key');

            const User = require('../models/User');
            req.user = await User.findById(decoded.id).select('-password');

            if (req.user && req.user.role === 'admin') {
                next();
            } else {
                res.status(401).json({ message: 'Not authorized as admin' });
            }
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect, protectAdmin };
