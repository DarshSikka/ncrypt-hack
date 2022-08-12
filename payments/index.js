const {generateOrder} = require("../generateOrder");
const express=require("express");
const router = express.Router();
router.post("/createorder", async (req, res)=>{
    const {amount} = req.body;
    console.log(amount);
    const order = await generateOrder(amount);
    console.log(order);
    return res.send(order);
})
module.exports = router; 