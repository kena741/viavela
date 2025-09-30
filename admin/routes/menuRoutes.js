const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect } = require('../../shared/middleware/auth');
const fileUpload = require('express-fileupload');

router.use(fileUpload());

// New route for creating menu with logo and items
router.post('/create', protect, menuController.createMenu);

router.route('/:hotelId/items')
    .get(protect, menuController.getMenuItems)
    .post(protect, menuController.createMenuItem);

router.route('/items/:id')
    .get(protect, menuController.getMenuItem)
    .put(protect, menuController.updateMenuItem)
    .delete(protect, menuController.deleteMenuItem);

module.exports = router;