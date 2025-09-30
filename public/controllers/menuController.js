const Hotel = require('../../database/models/Hotel');
const MenuItem = require('../../database/models/MenuItem');

// Get menu for a hotel
exports.getMenu = async (req, res, next) => {
    try {
        const hotel = await Hotel.findOne({ slug: req.params.slug });
        
        if (!hotel) {
            return res.status(404).render('error', { 
                message: 'Hotel not found' 
            });
        }

        const menuItems = await MenuItem.find({ hotel: hotel._id });
        const categories = [...new Set(menuItems.map(item => item.category))];

        res.render('menu', { 
            hotel,
            menuItems,
            categories
        });
    } catch (err) {
        next(err);
    }
};