const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRecord = await admin.auth().createUser({ email, password });
        res.status(201).json({ message: 'User created successfully!', uid: userRecord.uid });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { idToken } = req.body;
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    try {
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
        const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' };
        res.cookie('__session', sessionCookie, options);
        res.status(200).json({ message: 'Logged in successfully!' });
    } catch (error) {
        console.error('Error creating session cookie:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('__session');
    res.status(200).json({ message: 'Logged out successfully!' });
});

module.exports = router;