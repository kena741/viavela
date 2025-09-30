const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a hotel name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    contact: {
        type: String,
        required: [true, 'Please add contact information']
    },
    logo: {
        type: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create hotel slug from name
HotelSchema.pre('save', function(next) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    next();
});

module.exports = mongoose.model('Hotel', HotelSchema);