const express = require("express");
const { v4 } = require("uuid");
const router = express.Router();
const Product = require("../models/User");
router.post("/addproduct", (req, res)=>{ //admin feature
    const {name, price, gender, category, password, stock} = req.body;
    if(!password == process.env.ADMIN_PASSWORD){
        return res.send({
            error: true,
            message: "admin password is wrong"
        })
    }
    const _product = new Product({
        name, price, gender, category, stock, product_id: v4()
    })
    _product.save();
    return res.send({
        error: false,
        message: "product added"
    })
})
router.post("/addtocart", async (req, res)=>{
    const {username, product_id} = req.body;
    const usr = await username.findOne({username});
    usr.cart.push(product_id);
    usr.save();
    res.send({
        error: false,
        message: "added to cart"
    })
})
module.exports = router