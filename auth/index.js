const express = require("express");
const User = require("../models/User");
const {v4: uuid4} = require("uuid");
const router = express.Router();
const bcrypt = require("bcrypt");
const Product = require("../models/Product")
const sendEmail = require("../email")
const saltRounds = 10;
router.post("/signup", async (req, res)=>{
    const {username, email, password} = req.body;
    const find_username = await User.findOne({username});
    if (find_username){
        return res.send({
            error: true,
            message: "Username already taken"
        })
    }
    const find_email = await User.findOne({email});
    if (find_email){
        return res.send({
            error: true,
            message: "Email already taken"
        });
    }
    const uuid = uuid4();
    const hashed = await bcrypt.hash(password, saltRounds);
    const usr = new User({
        username, password: hashed, email, uuid
    });
    usr.save().then(()=>{
    return res.send({
        error: false,
        message: "user created",
        uuid: usr.uuid 
    })
    }).catch(err=>{
        return res.send({error: true, message: "validation error (you did not enter a compulsory field)"})
    })
})
router.post("/getuser", async(req, res)=>{
    const { uuid } = req.body;
    const findusr = await User.findOne({
        uuid
    })
    return res.send(findusr);
})
router.post("/login", async (req, res)=>{
    const {username_or_email, password} = req.body;
    const findusr = await User.findOne({$or: [
        {'username': username_or_email},
        {'email': username_or_email}
    ]});
    if(!findusr){
        return res.send({
            error: true, 
            message: "wrong username/email",
        })
    }
    else {
        const comparison_match = await bcrypt.compare(password, findusr.password);
        if(comparison_match){
            return res.send({
                error: false,
                message: "logged in",
                uuid: findusr.uuid
            })
        }
        else{
            return res.send({
                error: true,
                message: "wrong password",
                uuid: findusr.uuid
            })
        }
    }
});
router.post("/sendotp", async (req, res)=>{
    const { email } = req.body;
    const usr = await User.findOne({email});
    if(!usr){
        return res.send({
            error: true,
            message: "email not found"
        })
    }
    const otp = Math.floor(Math.random()*8999)+1000
    usr.otp = otp;
    sendEmail({
        to: usr.email,
        html: `<h3> Your OTP for sneakerstore is <hr /> <code>${usr.otp}</code> </h3>`,
        subject: "OTP for sneakerstore"
    })
    res.send({error: false, message: "otp sent"});
})
router.post("/confirmotp", async(req, res)=>{
    const {email, otp} = req.body;
    const usr = User.findOne({email})
    if(!usr){
        return res.send({
            error: true,
            message: "email not found"
        })
    }
    if(otp === usr.otp){
        res.send({
            error: false, message: "Proceed"
        })
    }
    else{
        res.send({
            error: true,
            message: "Scammer"
        })
    }
})
router.post("/getcart", async(req, res)=>{
    const {uuid} = req.body;
    const user = await User.findOne({ uuid });
    if(!user){
        return res.send({error: true, message: "user not found"})
    }
    const products = await Product.find({});
    const cart = user.cart.map(ele=>products.filter(element=>element.product_id===ele)[0])
    return res.send(cart);
})
module.exports = router;