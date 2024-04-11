var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
var app = express();
var http = require("http");
var server = http.createServer(app);
const mqtt = require("mqtt");
const cookieParser = require("cookie-parser");
const { PORT } = require("./cors/index");
var { roomTemperatureModel, userModel } = require("./database/models");
const fs = require('fs')
/**
 * Set mysql configuration parameters
 */

app.use(express.json());

app.use(
  cors({
    origin: true,
  })
);

app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());


// MQTT configuration //
const topicTemprature = "esp32/dht/temperature";
const topicHumidity = "esp32/dht/humidity";
const host = "127.0.0.1";
const port = "8883";
const connectUrl = `mqtts://${host}:${port}`;

//Connection configutaion for MQTT
const client = mqtt.connect(connectUrl, {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  username: "",
  password: "",
  reconnectPeriod: 1000,
  keepalive: 1000,
  clear: true,
  reconnectPeriod: 1000,
  protocolVersion: 4,
  clean: true,
  rejectUnauthorized: false,
  key: fs.readFileSync('./keys/client.key'),
  cert: fs.readFileSync('./keys/client.crt')
});


// Add a new user to DB
// const newUser = new userModel({email: 'hassamshoaib96@gmail.com', password: 'hassam'})
// newUser.save((err, data) => {
//   if(err) {
//     console.log("Failed to save user")
//   }else {
//     console.log("User created successfully")
//   }
// })


//Connect to MQTT
client.on("connect", () => {
  console.log("Connected");
  client.subscribe(topicTemprature, () => {
    console.log(`Subscribe to topic '${topicTemprature}'`);
  });
  client.subscribe(topicHumidity, () => {
    console.log(`Subscribe to topic '${topicHumidity}'`);
  });
});

//Recieve message from MQTT
client.on("message", function (topic, message) {
  let temperature = 0;
  let humidity = 0;
  if (topic === topicTemprature) {
    temperature = message.toString();
    console.log("Temperature", temperature);
    console.log("Message temprature", message.toString());
  }
  if (topic === topicHumidity) {
    humidity = message.toString();
    console.log("Humidity", humidity);
    console.log("Message humidity", message.toString());
  }
 
  //Saving tempratures into DB
  let newRoomTemperatures = new roomTemperatureModel({
    temperature,
    humidity,
  });
  newRoomTemperatures.save((err, data) => {
    if (!err) {
      console.log("Temperature is saved:", data);
    } else {
      console.log("Internal server error:", err);
      return;
    }
  });
   
  // client.end();
  return;
});
 

  app.post('/login', (req, res, next) => {
    const {email, password} = req.body
    userModel.find({email, password}).limit(1).exec((err, user) => {
      if(err){
        console.log("Error ", err)
        res.status(500).send({
          status: false,
          data: null,
          message: "Failed to find a user"
        })
      }else {
        if(user.length === 0) {
          res.status(500).send({
            status: false,
            data: null,
            message: "Failed to find a user"
          })
        } else {
          res.status(200).send({status: true, data: user, message: "Found a user"})
        }
      }
    })
  })

 app.get("/roomtemperature", (req, res, next) => {
  //Fetching tempratures from DB
  roomTemperatureModel
    .find({}, null)
    .sort({ createdOn: -1 })
    .limit(2)
    .exec((err, temperatureList) => {
      if (!err) {
        if (temperatureList.length) {
          console.log(temperatureList, "temperatureList found");
          res.send(temperatureList);
          return
        } else {
          console.log("No temprature found");
          res.status(404).send({
            noDataMessage: "No temprature found",
          });
          return
        }
      } else {
        console.log("Internal server error", err);
        res.status(500).send("Internal server error, " + err);
        return
      }
    });
});

// Server listening 
server.listen(PORT, () => {
  console.log("Server is Running:", PORT);
});
