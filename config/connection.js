const mongoose = require('mongoose');


module.exports.connect = function(){

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0', { dbName: 'trendly' })
  .then(() => {
    console.log('Connected to Database');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

}