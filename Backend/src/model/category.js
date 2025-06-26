const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {type: String,required: true,unique: true},
    category_id: {type: String,required: true,unique: true}
},{timestamps: true});

const Category =new  mongoose.model('Category', categorySchema);
module.exports = Category