const express = require("express");
const User = require("../models/User");
const {v4: uuid4} = require("uuid");
const router = express.Router();
const bcrypt = require("bcrypt");
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
    await usr.save();
    return res.send({
        error: false,
        message: "user created",
        uuid: usr.uuid
    })
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
module.exports = router;