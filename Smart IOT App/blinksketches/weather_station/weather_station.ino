#include <Arduino.h>

#include <WiFi.h>
#include <AsyncMqttClient.h>
#include "DHTesp.h"

#define DHTpin 15    //D15 of ESP32 DevKit

// Raspberry Pi Mosquitto MQTT Broker
#define MQTT_HOST IPAddress (192,168,42,69)
// For a cloud MQTT broker, type the domain name
//#define MQTT_HOST "example.com"
#define MQTT_PORT 1883
                              

DHTesp dht;

void setup() {

  Serial.begin(115200);
  Serial.println("\n... Starting ESP32 ...");

  dht.setup(DHTpin, DHTesp::DHT22);
  //Add wifi name and password here
  WiFi.begin("Redmi 9C", "554270554270");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WIFI");
  }
  Serial.println("WIFI Connected");
}

void loop() {
  float humidity = dht.getHumidity();
  float temperature = dht.getTemperature();
  String Shumidity = String(humidity);
  String Stemperature = String(temperature);

  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status

//    HTTPClient http;
//    //Add system ip here
//    http.begin("http://192.168.43.69:5000/roomtemperature");  //Specify destination for HTTP request
//
//    http.addHeader("Content-Type", "application/json");             //Specify content-type header
//    int httpResponseCode = http.POST("{ \"temperature\" :  " +  Stemperature   + " , \"roomId\": \"610e6abc662cec3b607c4096\" , \"humidity\" : " + Shumidity + " ,  \"unit\" : \"°C\" ,  \"roomName\" : \"livingRoom\" }"); //Send the actual POST request
//
//    if (httpResponseCode > 0) {
//
//      String response = http.getString();
//      Serial.println(httpResponseCode);   //Print return code
//      Serial.println(response);           //Print request answer
//
//    } else {
//      Serial.println("Error on sending POST: ");
//      Serial.println(httpResponseCode);
//    }

    delay(5000);

    Serial.print(Stemperature);
    Serial.println(" C");

    Serial.print(Shumidity);
    Serial.println(" H");
    Serial.println();
    http.end();  //Free resources

  } else {
    Serial.println("Error in WiFi connection");
  }

  delay(2000);  //Send a request every 100 seconds
}
