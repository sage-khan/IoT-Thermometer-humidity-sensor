// Database configuration ///////////////////////////////////////////////////////////////
const mongoose = require('mongoose');

/////////////////////////////////////////////////////////////////////////
// Mongoose connections
// let dbURI = "mongodb+srv://dbuser:dbpassword@cluster0.empmd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

let dbURI = "mongodb://localhost:27017/temperatures"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected")
})

mongoose.connection.on("disconnected", () => {
  // console.log("Mongoose disconnected")
  process.exit(1);
})

mongoose.connection.on('error', function (err) {//any error
  // console.log('Mongoose connection error: ', err);
  process.exit(1);
});

process.on('SIGINT', function () {  //this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    // console.log('Mongoose default connection closed');
    process.exit(0);
  });
});

// Database Models //////////////////////////////////////////////////////////////////////
// Db Schemas & Models

// Rooms temperature readings
var roomTemperatureSchema = new mongoose.Schema({
  temperature: { type: String },
  humidity: { type: String },
  createdOn: { type: Date, default: Date.now },
});

var usersSchema = new mongoose.Schema({
  email: {type: String},
  password: {type: String}
})
var roomTemperatureModel = mongoose.model("roomtemperatures", roomTemperatureSchema);
var userModel = mongoose.model('users', usersSchema)

module.exports = {
  roomTemperatureModel,
  userModel
}