const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`
  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Dublicate Field Value: ${value} Please use another value!`
  return new AppError(message, 400);
}

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data .${errors.join('. ')}`  
  return new AppError(message, 400)
}

const handleJsonWebTokenError = () => {
  return new AppError('Invalid Token, Please login again', 401);
}

const handleTokenExpiredError = () => {
  return new AppError('Your token has been expired, Please login again', 401);
}

const sendErrorProd = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message
    })
  } else {
    console.error('ERROR', '💥')
    res.status(500).json({
      status: 'fail',
      message: "Something went wrong !"
    })
  }
}

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    error: err,
    stack: err.stack
  })

}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'error';

  if (process.env.NODE_ENV == 'production') {
    let error = { ...err }
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error)
    }
    if(error.code === 11000) {
      error = handleDuplicateFieldsDB(error)
    }
    if(err.name === 'ValidationError'){
      error = handleValidationError(error)
    }
    if(error.name === 'JsonWebTokenError'){
      error = handleJsonWebTokenError();
    }
    if(error.name === 'TokenExpiredError'){
      error = handleTokenExpiredError()
    }
    sendErrorProd(res, error);
  } else if (process.env.NODE_ENV == 'development') {
    sendErrorDev(res, err);
  }
}