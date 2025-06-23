const express = require('express');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config();



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

const isAuthenticated = async (req, res, next) => {
    const sessionCookie = req.cookies.__session || '';

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;
        next();
    } catch (error) {
        res.redirect('/login.html');
    }
};

app.get('/', (req, res) => {
    const sessionCookie = req.cookies.__session || '';
    admin.auth().verifySessionCookie(sessionCookie, true)
        .then(() => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        })
        .catch(() => {
            res.redirect('/login.html');
        });
});

app.get('/index.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});