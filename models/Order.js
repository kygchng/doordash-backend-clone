const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    customer_phone_number: String,
    customer_email: String,
    items: Array,
    restaurant_id: String,
    restaurant_name: String,
    total_itemized_cost: Number,
    tax_cost: Number,
    total_cost: Number,
    pick_up_time: String
});

module.exports = mongoose.model("Order", OrderSchema);