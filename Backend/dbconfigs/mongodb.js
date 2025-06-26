const mongoose = require("mongoose");
const dotenv = require("dotenv");

const konnectDB=async()=>{
    await mongoose.connect(process.env.mongoKonnect)
    .then(()=>console.log("MONGODB CONNECTED"))
    .catch((err)=>console.log("MongoDB connection failed",err));

}
module.exports=konnectDB