const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY_ID,
    key_secret: process.env.RAZORPAY_API_KEY_SECRET
})
const generateOrder = (amount_in_rs) => {
const options = {
    amount:  amount_in_rs*100, // in paise
    currency: "INR",
    receipt:  `order_rcptid_${Math.floor(Math.random()*1000000000000000000)}`
}
instance.orders.create(options, (error, order)=>{
console.log(order);
})
}
