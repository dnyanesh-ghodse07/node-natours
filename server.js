const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log("UNCAUGHT EXCEPTION 💥 Shuttting Down...");
  console.log(err.name, err.message);
  process.exit(1);

});


dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful !');
  });

const port = process.env.PORT || 3000;
// START SERVER
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log("UNHANDLER REJECTIION 💥 Shutting Down");
  console.log(err.name, err.message);
  server.close(()=>{
    process.exit(1)
  })
})
