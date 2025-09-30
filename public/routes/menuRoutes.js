const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/:slug', menuController.getMenu);

module.exports = router;