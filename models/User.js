const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    otp: {
        type: Number,
        default: -9999
    },
    verified:{
        type: Boolean,
        default: false
    },
    uuid: {
        type: String,
        required: true
    },
    cart: {
        type: Array,
        default: []
    },
    orders: {
        type: Array,
        default: []
    }
})
const User = mongoose.model("User", schema, "users");
module.exports = User;