const mongoose = require("mongoose");
// const User = require("../models/userModel");


// {
//     "id": "f541",
//     "cityName": "Tirupati",
//     "country": "India",
//     "emoji": "🇮🇳",
//     "notes": "awesome visit 🚀",
//     "position": {
//       "lat": "13.642969603233988",
//       "lng": "79.4410580330029"
//     }

const citySchema = new mongoose.Schema({
    cityName:{
        type: String,
        required: [true,"A city must have it's name"],
    },
    country: {
        type: String,
        required : [true, "A city must have a country"]
    },
    flag: {
        type: String
    },
    notes: {
        type: String,
        required: [true, "A note about city is must!"]
    },
    position:{
       lat: {type: Number, required: [true, "latitide position is required"]},
       lng: {type: Number, required: [true, "longitude position is required"]}
    },
    visitedOn: {
        type: Date,
        default: Date.now()
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "user not logged in, please login"]
    }
});

const City = mongoose.model("City", citySchema);

module.exports = City;