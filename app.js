const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const citiesRouter =  require("./routes/cityRoutes");
const globalErrorMiddleware = require("./controllers/errorController");
const AppError = require("./utilities/appError");

app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
      origin: "https://world-wise-three-topaz.vercel.app",
      credentials: true,
  })
);
// app.use(express.cookie)

app.use("/worldwise/api/v1/user",userRouter);
app.use("/worldwise/api/v1/cities",citiesRouter);

app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorMiddleware);

module.exports = app;