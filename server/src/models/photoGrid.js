const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoGridSchema = new Schema({
    userId: {
        type: String,
        required: [true, 'user id field is required']
    },
    photos: {
        type: Array,
        required: [true, 'Photos field is required']
    }
});

const PhotoGrid = mongoose.model('photoGrid',PhotoGridSchema);

module.exports = PhotoGrid;