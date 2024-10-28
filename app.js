const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const citiesRouter =  require("./routes/cityRoutes");
const globalErrorMiddleware = require("./controllers/errorController");
const AppError = require("./utilities/appError");

app.use(express.json());
app.use(cors());


app.use("/worldwise/api/v1/user",userRouter);
app.use("/worldwise/api/v1/cities",citiesRouter);


app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorMiddleware);




module.exports = app;
