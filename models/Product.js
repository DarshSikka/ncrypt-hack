const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    gender: {
        type: String, // either M(male), F(female) or B(both)
        required: true,
    },
    category: {
        type: String, // eg. Sports, party etc. 
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    product_id: {
        type: String,
        required: true
    }
})
const product = mongoose.model("Product", schema, "products")
module.exports = product