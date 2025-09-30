const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { protect } = require('../../shared/middleware/auth');

router.route('/')
    .get(protect, hotelController.getHotels)
    .post(protect, hotelController.createHotel);

router.route('/:id')
    .get(protect, hotelController.getHotel)
    .put(protect, hotelController.updateHotel)
    .delete(protect, hotelController.deleteHotel);

module.exports = router;