const express = require("express");
const { v4 } = require("uuid");
const router = express.Router();
const User = require("../models/User")
const Product = require("../models/Product");
const Order = require("../models/Order");
router.post("/addproduct", (req, res)=>{ //admin feature
    const {name, price, gender, category, password, stock, image_url, color, brand, description} = req.body;
    if(!password == process.env.ADMIN_PASSWORD){
        return res.send({
            error: true,
            message: "admin password is wrong"
        })
    }
    const _product = new Product({
        name, price, gender, category, stock, product_id: v4(), image_url, color, brand, description
    })
    _product.save();
    return res.send({
        error: false,
        message: "product added"
    })
})
router.post("/addtocart", async (req, res)=>{
    const {uuid, product_id} = req.body;
    const usr = await User.findOne({uuid});
    console.log(usr, product_id);
    usr.cart.push(product_id);
    usr.save();
    res.send({
        error: false,
        message: "added to cart"
    })
});
router.post("/removefromcart", async (req, res)=>{
    const {uuid, product_id} = req.body;
    console.log(uuid, product_id);
    const usr = await User.findOne({uuid});
    console.log(usr, product_id);
    usr.cart = usr.cart.filter(product => product!==product_id);
    console.log(usr.cart);
    usr.save();
    res.send({
        error: false,
        message: "removed from cart"
    })
});
router.get("/getproducts", async (_, res)=> {
    const products = await Product.find({});
    return res.send(products);
})
router.get("/getproduct", async(req, res)=>{
    const {id} = req.query;
    const product = await Product.findOne({product_id: id})
    return res.send(product);
})
router.post("/makeorder", async(req, res)=>{
    const {username, items, address, phone, email} = req.body;
    const order = new Order({
        user_username: username, items, address, user_mobile: phone, user_email: email
    })
    const usr = await User.findOne({username})
    usr.orders.push(order);
    usr.cart=[]
    usr.save();
    return res.send(order);
})
module.exports = router