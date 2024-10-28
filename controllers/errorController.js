const AppError = require("../utilities/appError");

function sendDuplicateError(err) {
  const DuplicateEmailError =
    "Email address taken, please try again with different email!";
  return new AppError(DuplicateEmailError, 400);
}

function sendProdError(err, req, res){

  //if error is operational, send error to the client
  if(err.isOperational){
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  else{
    console.error("ERROR: ",err);
    //send a generic message to the client
    return res.status(500).json({
      status: "error",
      message: "something went very wrong!",
    });
  }
}

module.exports = (err,req,res,next)=>{

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  
  let error = {...err};
  error.message = err.message;

  if (error.code === 11000) {
  error = sendDuplicateError(error);
  }

  sendProdError(error,req,res);
}