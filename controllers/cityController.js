const City = require("../models/cityModel");
const AppError = require("../utilities/appError");
const catchAsync = require("../utilities/catchAsync");

exports.createCity = catchAsync(async(req,res,next)=>{
    // console.log(req.currentUser);

    if(!req.currentUser._id){
        next(new AppError("You are not logged in, please login to get access",401));
    }
    const id = req.currentUser._id;

    const {cityName,country,notes,flag,position,_id,visitedOn} =  await City.create({...req.body,userId:id})

    res.status(201).json({
        status: "success",
        createdCity: {
            cityName,
            country,
            notes,
            flag,
            position,
            _id,
            visitedOn
        }
    })
})

exports.getCities = catchAsync(async(req,res,next)=>{
 
    if(!req.currentUser._id){
        next(new AppError("You are not logged in, please login to get access",401));
    }
    const userId = req.currentUser._id;
    const cities = await City.find({userId}).select("-userId -__v");


    res.status(200).json({
        status: "sucess",
        data: {
            results: cities.length,
            cities
        }
    })
});

exports.deleteCity = catchAsync(async(req,res,next)=>{
    // if(!req.currentUser._id){
    //     next(new AppError("You are not logged in, please login to get access",401));
    // }
    const id = req.params["id"];

    const deletedCity = await City.findOneAndDelete({_id:id});


    res.status(200).json({
        status: "success",
        data: {
            deletedCity
        }
    })
})
