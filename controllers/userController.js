const User = require("../models/userModel");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.getAllUsers = catchAsync(async(req,res,next)=>{
    const users = await User.find({});
    
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    })
})

// exports.createUser = catchAsync(
//     async (req, res, next) => {

//         const { userName, email, password } = req.body;

//         if (!userName || !email || !password) {
//             next(new AppError("Please enter userName, email, password",400));
//             return;
//         }

//         const user = await User.create({
//             userName,
//             email,
//             password,
//         });

//         res.status(201).json({
//             status: "sucess",
//             user
//         })
// } )

// exports.signup = async(req,res,next)=>{
//     const {userName, email,password} = req.body.body;
//     const user = await 
// } 