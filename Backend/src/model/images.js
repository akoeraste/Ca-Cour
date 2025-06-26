const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image_id : {type: String,required: true,unique: true},
    listing_id : {type: String,required: true,unique: true},
    image_url : {type: String,required: true,unique: true}
},{timestamps: true});

const Image = new mongoose.model('Image', imageSchema);
module.exports = Image