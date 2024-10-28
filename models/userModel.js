const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "A user must have a userName"]
    },
    email:{
        type: String,
        required: [true, "A user must have an email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "user must enter password"],
        minlength: 8,
        select: false
    }
});

//Document middleware function:
userSchema.pre("save",async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

//instance methods:

userSchema.methods.checkPassword = async function(inputPassword, userPassword){
    return await bcrypt.compare(inputPassword,userPassword);
}

const User = mongoose.model("User",userSchema);

module.exports = User;