const MenuItem = require('../../database/models/MenuItem');
const Hotel = require('../../database/models/Hotel');

// Create menu item
exports.createMenuItem = async (req, res, next) => {
    try {
        // Add hotel to req.body
        req.body.hotel = req.params.hotelId;

        const hotel = await Hotel.findById(req.params.hotelId);
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
                error: 'Not authorized to add menu items to this hotel'
            });
        }

        const menuItem = await MenuItem.create(req.body);

        res.status(201).json({
            success: true,
            data: menuItem
        });
    } catch (err) {
        next(err);
    }
};

// Get all menu items for a hotel
exports.getMenuItems = async (req, res, next) => {
    try {
        const menuItems = await MenuItem.find({ hotel: req.params.hotelId });

        res.json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (err) {
        next(err);
    }
};

// Create menu for a hotel (with logo and menu items)
exports.createMenu = async function(req, res, next) {
    try {
        // Handle logo upload
        let logoPath = '';
        if (req.files && req.files.logo) {
            const logo = req.files.logo;
            logoPath = path.join(UPLOAD_PATH, Date.now() + '-' + logo.name);
            await logo.mv(logoPath);
        }

        // Create hotel
        const hotel = await Hotel.create({
            name: req.body.restaurantName,
            logo: logoPath,
            user: req.user.id,
            slug: req.body.restaurantName.toLowerCase().replace(/\s+/g, '-')
        });

        // Create menu items
        const items = req.body.itemName.map(function(name, idx) {
            return {
                name: name,
                price: req.body.itemPrice[idx],
                hotel: hotel._id
            };
        });
        await MenuItem.insertMany(items);

        // Generate QR code for menu page
        const qrPath = path.join(QRCODE_PATH, hotel._id + '.png');
        await QRCode.toFile(qrPath, PUBLIC_URL + '/menu/' + hotel.slug);

        res.render('createMenu', {
            qrCodeUrl: '/qrcodes/' + hotel._id + '.png',
            success: true
        });
    } catch (err) {
        next(err);
    }
};

// Get single menu item
exports.getMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            data: menuItem
        });
    } catch (err) {
        next(err);
    }
};

// Update menu item
exports.updateMenuItem = async (req, res, next) => {
    try {
        let menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        // Get hotel
        const hotel = await Hotel.findById(menuItem.hotel);

        // Make sure user is hotel owner
        if (hotel.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this menu item'
            });
        }

        menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: menuItem
        });
    } catch (err) {
        next(err);
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        // Get hotel
        const hotel = await Hotel.findById(menuItem.hotel);

        // Make sure user is hotel owner
        if (hotel.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this menu item'
            });
        }

        await menuItem.remove();

        res.json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};