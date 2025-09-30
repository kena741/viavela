const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../database/db');
const config = require('../config/config');
const menuRoutes = require('./routes/menuRoutes');

// Connect to database
connectDB();

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
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
const PORT = config.PUBLIC_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Public server running on port ${PORT}`);
});