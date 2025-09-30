require('dotenv').config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    ADMIN_PORT: process.env.ADMIN_PORT,
    PUBLIC_PORT: process.env.PUBLIC_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    PUBLIC_URL: process.env.PUBLIC_URL,
    UPLOAD_PATH: process.env.UPLOAD_PATH,
    QRCODE_PATH: process.env.QRCODE_PATH
};