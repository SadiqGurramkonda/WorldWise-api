const app = require("./app");
const mongoose = require("mongoose");
const dotenv =  require("dotenv");
dotenv.config({path:"./config.env"});

const mongooseURL = process.env.DB_URL.replace("<DB_PASSWORD>",process.env.DB_PASSWORD);
mongoose.connect(mongooseURL).then(()=>{
    console.log("DB Connected...")
}).catch(err=>console.log(err));



app.listen(process.env.PORT,()=>{console.log(`server listening on ${process.env.PORT}`)});