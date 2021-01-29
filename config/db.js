//Bring in mongoose for the managing the data of the database
const mongoose = require('mongoose');

//Add connection logic, by adding the string you brought into the default.json file
const config = require('config');

//Grab the monguUI value from the default.json file
const db = config.get('mongoURI');

//Connect to mongodb
mongoose.connect(db);

//Create something you can call inside your server.js
const connectDB = async () => {
  //Add a try catch block if there is an error
  try {
    //If it connects
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    //If it doesnt connect return error message
    console.log(err.message);
    //Exit process with failure
    process.exit(1);
  }
};
//export module so it is easily accessed by server.js
module.exports = connectDB;
