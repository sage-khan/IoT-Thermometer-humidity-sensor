var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
var app = express();
var http = require("http");
var server = http.createServer(app);
const socketIo = require("socket.io");
const mqtt = require("mqtt");
const cookieParser = require("cookie-parser");
const { PORT } = require("./cors/index");
var { roomTemperatureModel } = require("./database/models");

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
const port = "1883";
const connectUrl = `mqtt://${host}:${port}`;
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
});

client.on("connect", () => {
  console.log("Connected");
  client.subscribe(topicTemprature, () => {
    console.log(`Subscribe to topic '${topicTemprature}'`);
  });
  client.subscribe(topicHumidity, () => {
    console.log(`Subscribe to topic '${topicHumidity}'`);
  });
});

client.on("message", function (topic, message) {
  let temperature = 0;
  let humidity = 0;
  if (topic === topicTemprature) {
    temperature = message.toString();
    console.log("temperature", temperature);
    console.log("Message temprature", message.toString());
  }
  if (topic === topicHumidity) {
    humidity = message.toString();
    console.log("humidity", humidity);
    console.log("Message humidity", message.toString());
  }
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
  client.end();
  return;
});
 
 app.get("/roomtemperature", (req, res, next) => {
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

// Server listening //
server.listen(PORT, () => {
  console.log("Server is Running:", PORT);
});
