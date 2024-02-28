const mongoose = require('mongoose');


/* This code exports a function named `connect` that connects to a MongoDB database using Mongoose. The
function uses the `mongoose.connect()` method to establish a connection to the database with the
specified URL and options. If the connection is successful, it logs a message to the console. If
there is an error, it logs an error message to the console. */
module.exports.connect = function(){
mongoose
  .connect(
    process.env.ATLAS_URI
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
}