const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    restaurant_name: String,
    restaurant_menu: Array,
    restaurant_category_tags: Array,
    email: String,
    about_description: String,
    availability: {
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String,
        sunday: String
    },
    wait_time: String
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);