const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    menu_name: String,
    restaurant_id: String,
    items: Array,
    category_tags: Array
});

module.exports = mongoose.model("Menu", MenuSchema);