const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    restaurant_id: String,
    menu_id: String,
    item_category_tags: Array,
    price: Number,
    imageURL: String,
    item_name: String
});

module.exports = mongoose.model("Item", ItemSchema);