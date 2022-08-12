const express = require("express");
const app = express();
const auth = require("./auth");
const products = require("./products");
const payments = require("./payments");
app.use(express.static("public"));
require("dotenv").config()
const mongoose = require("mongoose");
const whitelistedDomains = [process.env.WHITELIST_DOMAIN, "https://syntax-backend-exun.herokuapp.com/"]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelistedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}
mongoose.connect(process.env.DB_URI, {useUnifiedTopology:true, useNewUrlParser:true}, (error, result)=>{
    console.log("connected");
})
const PORT = process.env.PORT || 4000;
const cors = require("cors");
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use("/auth", auth);
app.use("/products", products);
app.use("/payments", payments);
app.get("/", (req, res)=>{
    res.send("Running app");
});
app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));