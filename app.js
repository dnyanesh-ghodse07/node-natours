const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes.js');
const tourRouter = require('./routes/tourRoutes.js');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(x);
  next();
});

//ROUTING
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`cant find ${req.originalUrl} on this server!`)
  // err.message = 'fail',
  // err.statusCode = 404

  next(new AppError(`cant find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app;
