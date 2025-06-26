const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    favorite_id : {type: String,required: true,unique: true},
    user_id : {type: String,required: true,unique: true},
    listing_id : {type: String,required: true,unique: true}
},{timestamps: true});

const Favorite = new mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite