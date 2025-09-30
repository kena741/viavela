const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const connectDB = require('../database/db');
const config = require('../config/config');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const menuRoutes = require('./routes/menuRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

// Routes
app.use('/', authRoutes);
app.use('/hotels', hotelRoutes);
app.use('/menu', menuRoutes);

// Error handling
app.use((req, res) => {
    res.status(404).render('error', { message: 'Page not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Server error' });
});

// Start server
const PORT = config.ADMIN_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Admin server running on port ${PORT}`);
});