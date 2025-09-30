const Hotel = require('../../database/models/Hotel');
const QRCode = require('qrcode');
const { PUBLIC_URL, QRCODE_PATH } = require('../../config/config');
const fs = require('fs');
const path = require('path');

// Create a new hotel
exports.createHotel = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const hotel = await Hotel.create(req.body);

        // Generate QR code
        const qrPath = path.join(QRCODE_PATH, `${hotel._id}.png`);
        await QRCode.toFile(qrPath, `${PUBLIC_URL}/menu/${hotel.slug}`, {
            color: {
                dark: '#000',
                light: '#FFF'
            }
        });

        res.status(201).json({
            success: true,
            data: hotel
        });
    } catch (err) {
        next(err);
    }
};

// Get all hotels
exports.getHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find({ user: req.user.id });
        res.json({
            success: true,
            count: hotels.length,
            data: hotels
        });
    } catch (err) {
        next(err);
    }
};

// Get single hotel
exports.getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({
                success: false,
                error: 'Hotel not found'
            });
        }

        res.json({
            success: true,
            data: hotel
        });
    } catch (err) {
        next(err);
    }
};

// Update hotel
exports.updateHotel = async (req, res, next) => {
    try {
        let hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                error: 'Hotel not found'
            });
        }

        // Make sure user is hotel owner
        if (hotel.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this hotel'
            });
        }

        hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: hotel
        });
    } catch (err) {
        next(err);
    }
};

// Delete hotel
exports.deleteHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                error: 'Hotel not found'
            });
        }

        // Make sure user is hotel owner
        if (hotel.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this hotel'
            });
        }

        await hotel.remove();

        // Delete QR code
        const qrPath = path.join(QRCODE_PATH, `${hotel._id}.png`);
        if (fs.existsSync(qrPath)) {
            fs.unlinkSync(qrPath);
        }

        res.json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};