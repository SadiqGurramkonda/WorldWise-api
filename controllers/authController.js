const jwt = require("jsonwebtoken");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const User =  require("../models/userModel");


const signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_TOKEN_EXPIRES_IN
    });
}


exports.signup = catchAsync(async(req,res,next)=>{
    const {username:userName, email, password} = req.body;
    

    if(!userName || !email || !password){
        return next(new AppError("userName email and password is required",400));
    }

    const user = await User.create({
        userName,
        email,
        password
    });

    const token = signToken(user._id);

    res.status(201).json({
        status: "sucess",
        data:{
            token
        }
    })
});

exports.login = catchAsync(async(req,res,next)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError("Enter email and Password!",400));
    }
    const user = await User.findOne({email}).select('+password');
    if(!user  || !(await user.checkPassword(password,user.password))){
       return next(new AppError("email or password incorrect",401));
    }
    console.log(user.userName);
    const token = signToken(user._id);
    res.status(200).json({
        status: "sucess",
        userName: user.userName,
        token,
    })
});

exports.protect = catchAsync(async(req,res,next)=>{

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new AppError("You are not logged in, please login to get access",401)); 
    };

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError("token issued for the user no longer exists!",404));
    }

    req.currentUser = currentUser;
    next();
});


exports.restrictTo = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.currentUser?.role)){
            return next(new AppError("not permitted to do this action", 403));
        }
        next();
    }
}

