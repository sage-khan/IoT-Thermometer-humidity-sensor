#include "DHT.h"
#include <WiFi.h>
extern "C" {
#include "freertos/FreeRTOS.h"
#include "freertos/timers.h"
}
#include <AsyncMqttClient.h>
#include <WiFiClientSecure.h>

const char* ssid     = "CTC-1";     // your network SSID (name of wifi network)
const char* password = "Delta72@@=="; // your network password

#define WIFI_SSID "CTC-1"
#define WIFI_PASSWORD "Delta72@@=="

//#define WIFI_SSID "iPhone"
//#define WIFI_PASSWORD "hassam123"
//#define WIFI_SSID "CTC-1"
//#define WIFI_PASSWORD "Delta72@@=="
#define MQTT_HOST IPAddress (192,168,0,117)
#define MQTT_PORT 1883

// Temperature MQTT Topics
#define MQTT_PUB_TEMP "esp32/dht/temperature"
#define MQTT_PUB_HUM  "esp32/dht/humidity"
#define DHTPIN 15
#define DHTTYPE DHT22   // DHT 22

DHT dht(DHTPIN, DHTTYPE);

float temp;
float hum;

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;
TimerHandle_t wifiReconnectTimer;

unsigned long previousMillis = 0;
const long interval = 10000;

void connectToWifi() {
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void connectToMqtt() {
  Serial.println("Connecting to MQTT...");
  mqttClient.connect();
}

void WiFiEvent(WiFiEvent_t event) {
  Serial.printf("[WiFi-event] event: %d\n", event);
  switch (event) {
    case SYSTEM_EVENT_STA_GOT_IP:
      Serial.println("WiFi connected");
      Serial.println("IP address of ESP32: ");
      Serial.println(WiFi.localIP());
      connectToMqtt();
      break;
    case SYSTEM_EVENT_STA_DISCONNECTED:
      Serial.println("WiFi lost connection");
      xTimerStop(mqttReconnectTimer, 0); // ensure we don't reconnect to MQTT while reconnecting to Wi-Fi
      xTimerStart(wifiReconnectTimer, 0);
      break;
  }
}

void onMqttConnect(bool sessionPresent) {
  Serial.println("Connected to MQTT.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
  Serial.println("Disconnected from MQTT.");
  if (WiFi.isConnected()) {
    xTimerStart(mqttReconnectTimer, 0);
  }
}

void onMqttPublish(uint16_t packetId) {
  Serial.print("Publish acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println(MQTT_HOST);


  dht.begin();

  mqttReconnectTimer = xTimerCreate("mqttTimer", pdMS_TO_TICKS(2000), pdFALSE, (void*)0, reinterpret_cast<TimerCallbackFunction_t>(connectToMqtt));
  wifiReconnectTimer = xTimerCreate("wifiTimer", pdMS_TO_TICKS(2000), pdFALSE, (void*)0, reinterpret_cast<TimerCallbackFunction_t>(connectToWifi));

  WiFi.onEvent(WiFiEvent);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  //mqttClient.onSubscribe(onMqttSubscribe);
  //mqttClient.onUnsubscribe(onMqttUnsubscribe);
  mqttClient.onPublish(onMqttPublish);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
//  mqttClient.setSecure(true);
  //  mqttClient.setServer("192.168.0.112", 1883);
  // If your broker requires authentication (username and password), set them below
  mqttClient.setCredentials("", "");
  connectToWifi();
}

void loop() {
  unsigned long currentMillis = millis();
  // Every X number of seconds (interval = 10 seconds)
  // it publishes a new MQTT message
  if (currentMillis - previousMillis >= interval) {
    // Save the last time a new reading was published
    previousMillis = currentMillis;
    // New DHT sensor readings
    hum = dht.readHumidity();
    Serial.print("Humidity ");
    Serial.println(hum);
    // Read temperature as Celsius (the default)
    temp = dht.readTemperature();
    Serial.print("Temprature ");
    Serial.println(temp);
    // Read temperature as Fahrenheit (isFahrenheit = true)
    temp = dht.readTemperature(true);

    // Check if any reads failed and exit early (to try again).
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Publish an MQTT message on topic esp32/dht/temperature
  uint16_t packetIdPub1 = mqttClient.publish("esp32/dht/temperature", 1, true,  String(temp).c_str());
  Serial.printf("Publishing on topic %s at QoS 1, packetId: %i", MQTT_PUB_TEMP, packetIdPub1);
  Serial.printf("Message: %.2f \n", temp);

  // Publish an MQTT message on topic esp32/dht/humidity
  uint16_t packetIdPub2 = mqttClient.publish(MQTT_PUB_HUM, 1, true, String(hum).c_str());
  Serial.printf("Publishing on topic %s at QoS 1, packetId %i: ", MQTT_PUB_HUM, packetIdPub2);
  Serial.printf("Message: %.2f \n", hum);
  delay(5000);
// http.POST("{ \"temperature\" :  " +  Stemperature   + " , \"roomId\": \"610e6abc662cec3b607c4096\" , \"humidity\" : " + Shumidity + " ,  \"unit\" : \"°C\" ,  \"roomName\" : \"livingRoom\" }");  http.POST("{ \"temperature\" :  " +  Stemperature   + " , \"roomId\": \"610e6abc662cec3b607c4096\" , \"humidity\" : " + Shumidity + " ,  \"unit\" : \"°C\" ,  \"roomName\" : \"livingRoom\" }"); 
}
