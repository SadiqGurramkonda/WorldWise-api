const jwt = require("jsonwebtoken");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const User = require("../models/userModel");
const { json } = require("express");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username: userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return next(new AppError("userName email and password is required", 400));
  }

  const user = await User.create({
    userName,
    email,
    password,
  });

  const token = signToken(user._id);

  res.cookie("token", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  res.status(201).json({
    status: "success",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Enter email and Password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("email or password incorrect", 401));
  }

  const token = signToken(user._id);
  res.cookie("token", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
    sameSite: "none",
  });
  res.status(200).json({
    status: "sucess",
    userName: user.userName,
    message: "Login succesfull",
  });
});

exports.logout = catchAsync(async (req, res) => {
  res.cookie("token", "loggedOut", {
    expires: new Date(Date.now()),
    secure: false,
    httpOnly: true,
    sameSite: "none",
  });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.token && req.cookies.token.startsWith("ey")) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in, please login to get access", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("token issued for the user no longer exists!", 404)
    );
  }

  req.currentUser = currentUser;
  next();
});

exports.getUser = catchAsync(async (req, res, next) => {
  if (!req.currentUser) {
    next(new AppError("user doesn't exists", 404));
  }
  return res.status(200).json({
    userData: req.currentUser,
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser?.role)) {
      return next(new AppError("not permitted to do this action", 403));
    }
    next();
  };
};
