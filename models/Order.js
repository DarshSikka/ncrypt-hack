const mongoose = require("mongoose");
const schema = new mongoose.Schema({
items: {
    type: Array, 
    required: true
},
user_username: {
    type: String,
    required: true
},
user_mobile: {
    type: String,
    required: true
},
user_email: {
    type: String,
    required: true
},
date: {
    type: Date,
    default: new Date()
}
})
const model = mongoose.model("Order", schema, "orders");
module.exports = model;