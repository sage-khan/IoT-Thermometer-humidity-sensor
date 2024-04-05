
#include <PubSubClient.h>
#include<WiFiClientSecure.h>
#include <AsyncMqttClient.h>
#include<WiFi.h>
#include <DHT.h>
 
#define DHT11PIN 23
 
const char* ssid = "Redmi 9C";
const char* password = "554270554270";
const char* mqtt_server = "192.168.43.69";

//const char* mqtt_user = "admin";
//const char* mqtt_pass ="admin";

const char* ca_cert= \
"-----BEGIN CERTIFICATE-----\n"\
"MIIDtTCCAp2gAwIBAgIUQiPQyYtbVk0fAOfI+a52SG9lHZwwDQYJKoZIhvcNAQEL\n"\
"BQAwajELMAkGA1UEBhMCU0UxEjAQBgNVBAgMCVN0b2NraG9sbTESMBAGA1UEBwwJ\n"\
"U3RvY2tob2xtMRAwDgYDVQQKDAdoaW1pbmRzMQswCQYDVQQLDAJDQTEUMBIGA1UE\n"\
"AwwLMTcyLjIwLjEwLjgwHhcNMjExMjMwMDkyMTUzWhcNMjIxMjMwMDkyMTUzWjBq\n"\
"MQswCQYDVQQGEwJTRTESMBAGA1UECAwJU3RvY2tob2xtMRIwEAYDVQQHDAlTdG9j\n"\
"a2hvbG0xEDAOBgNVBAoMB2hpbWluZHMxCzAJBgNVBAsMAkNBMRQwEgYDVQQDDAsx\n"\
"NzIuMjAuMTAuODCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK7bQX3u\n"\
"jGtilvO7RSbdXc2Kdi/DcDyXpOxclE+SzaDcQYzL0NkXSElDQH32UICqimxdo4sq\n"\
"a6yxiHMXhdtAxw2NBfwrzO+w5RfNCxfMDhyzGtqDKsaIZkok5SNs5OZiTsS778Ix\n"\
"XJ0G9fUGwIzoDseRf6xSk2LO6US+P98JcGrV/4bTDfBwUO3R3SyKAQpSEXLOoOo0\n"\
"gucXCdxYwwD2rST8adrDTUCE0TCNW+OLLrNYcRDzHgUpuiWUq3AhoYT8Zdu6EUJu\n"\
"CQ1aSNR5v/5dbfi12NcQtjM8hHte0OxsYDFpOP1kpdKFKzhycuG6I3KmQ7G/Avr3\n"\
"0J5ZcCyAgz/fwE8CAwEAAaNTMFEwHQYDVR0OBBYEFLWa8atISC7Zw4qowZ9EGUMS\n"\
"1yduMB8GA1UdIwQYMBaAFLWa8atISC7Zw4qowZ9EGUMS1yduMA8GA1UdEwEB/wQF\n"\
"MAMBAf8wDQYJKoZIhvcNAQELBQADggEBAGs308S9XjpKIFa6yVDg1BV2OUhNs+2K\n"\
"hAyJlqfSXXTiXFGIm/dadxjjONqwn+mlexayuTCzAAVxY9Kq0Cpz9qVzGQp4JRYr\n"\
"jdTH4qvt2eo++V26AewrTL15mdBMGYpEdv32kupfHTQTVU/boDm+/XKi/6PGDtyr\n"\
"2VJYzqv6LYqqjBraypylVwDziZIgIUsQZ4S4Dlx+JAkdN7tSPgCFCW0oioEXhEI8\n"\
"hVom3KNuSDmzvK2DdANYQZTEvHKDEQz12NPORAehhpl0nOpkiq0W3TRXS7/OcUKr\n"\
"fa7JVhaCemoaERzA5gh7nbnysvQHZtEtvwPp4/CrTBNSXeVovrzQS+I=\n"\
"-----END CERTIFICATE-----\n";

const char* client_key = \
"-----BEGIN PRIVATE KEY-----\n"\
"MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUYw1S959AO/YI\n"\
"KUMg7Ae+1uYIjAcdLPARt5JrBNJStByeThqpjC1hu9nI/lV+Bxz4Qw6rIadRMhKR\n"\
"mQSKra9998JhktUTSqJRO5/PNEWEfH6CQ0ohTqNU/rC67Wbl4xuV6DdLsUsaYVgT\n"\
"W6+cv83toRr+DJAqUOrb4+2pJ/tpHJt0nbvex8svJp2CExKo0yOcDTbwlxATxUSp\n"\
"0SG1ZJkVQ3YGoRgeGh8PwYd1URIxro3GgUxpBvTIxEBmbiptEdm/YsrsaZsamG4u\n"\
"/2A0+wO7RJtjWltRl5SZeNaWfNG+T9P4Jjn0R9H5O3wDu8HH6YagLCa3BJzZUcwS\n"\
"WEi06UXdAgMBAAECggEAAiobD45/4q8AJ2SJ3BlVTN/ll6gbRg2+sDEipPeQ6ZBC\n"\
"i5rexH3Hh2vBx1dPaYmxOGOw9kdRORxQoLsIylCeoLyFKerN3bTD6bfSimrzqGsY\n"\
"yPZ3/qK0B6Ce2xDVtlMPS8+CVls+TJltK3YipVWcR8DKd+6KpS707clckzENBWAY\n"\
"Z6SzORXFFmSOM7L8JwkPPs6kl9fn2mmtchRoGAHIzj8VF0w1c8Tau0vZBSbh65jx\n"\
"eGtG3LEzKG0MrO1cO8AKmRGz1S3zrysnziJFRVbrAoIi0gpoUUQO9hpgpy0ApVgF\n"\
"52Z937PIiV+pBimEXwVZwiVzLl9rVy9x42V3CjwaqwKBgQDxb4t7PndgsseWwJO7\n"\
"SszNZYO1wij4+H6BJvrH53dbUxU7C+b1x67QBESeaa7lr+hjB9YCRMWZurTMRGPA\n"\
"Yt46OQ0fLjSBo4mHI7cLbrtySwA4M2+zwGXm02NmGhRD3As1vdwtou3whDHxB1Rm\n"\
"rZpfN0qDsSgDVV3mbfMDWbMrcwKBgQDhMuk3AuY3ch7xMadCqWnYsrCGBB18ScvR\n"\
"5qBRIwaSamlbmueI8/zORyyaxw/OQ203rRimVcC0PKCa+CId4D2vbWHb2ljMOV8Y\n"\
"1m+d3TYyaR7QW3xvp72lbssi2V+dgR2efK1Kwhfmw1hFkDkoEntRJrjh6YlOMm6s\n"\
"3GmMw3MVbwKBgGFGZPdZ+rUuMvZNTvhmMdALt55yxRlS3X1h3CbQ3qkf92zb5clf\n"\
"E9Lh9VeyEvKeBk5oKNSvKsI+lHu8jkhETW8970iB0EvvPQkC3cwwaDurdkIujzHo\n"\
"MeZngyPvG/0fWjDj9yM4AxAl4w1Ou7XG+myklVQr+4gkS/n8kK3n5SV7AoGBALq0\n"\
"2fQY/EOV4x93WkQDb1UQ+RdzS/riuBBDlEEQt/8mKEmhiTrbhoqDKfD8/xa0glV5\n"\
"tokZaZZE+abh+G8qnhnWpx5+zcYr/rL5/jo00B1FWB3I68cqnCoPTG2NKR/Nj3/5\n"\
"wDbN6sEQzhuGckzN3d2vK/NpCsSBPY8lgoEI/l4TAoGBAM4al7+3EEgpdLtIUdHb\n"\
"quyJhnGC2aRRNE2fHOduxixAiYhLp6BgsCPKK/PeX1W9U7dkpG52P+7J5Vwr4k/W\n"\
"2Aca81zuKxr9mH1hpNrymejcPWAHV8xn8LpcZuFoD0Q9eX2e5aRSCZ8lem7dCn4D\n"\
"dJxmigcpIMahNMWF39iA3xg+\n"\
"-----END PRIVATE KEY-----\n";



 
const char* client_cert = \
"-----BEGIN CERTIFICATE-----\n"\
"MIIDXzCCAkcCFGdgO+R2BvQLVfsw7D5YqgIPwiIQMA0GCSqGSIb3DQEBCwUAMGox\n"\
"CzAJBgNVBAYTAlNFMRIwEAYDVQQIDAlTdG9ja2hvbG0xEjAQBgNVBAcMCVN0b2Nr\n"\
"aG9sbTEQMA4GA1UECgwHaGltaW5kczELMAkGA1UECwwCQ0ExFDASBgNVBAMMCzE3\n"\
"Mi4yMC4xMC44MB4XDTIxMTIzMDA5MjQ0M1oXDTIyMTIzMDA5MjQ0M1owbjELMAkG\n"\
"A1UEBhMCU0UxEjAQBgNVBAgMCVN0b2NraG9sbTESMBAGA1UEBwwJU3RvY2tob2xt\n"\
"MRAwDgYDVQQKDAdoaW1pbmRzMQ8wDQYDVQQLDAZDbGllbnQxFDASBgNVBAMMCzE3\n"\
"Mi4yMC4xMC44MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1GMNUvef\n"\
"QDv2CClDIOwHvtbmCIwHHSzwEbeSawTSUrQcnk4aqYwtYbvZyP5Vfgcc+EMOqyGn\n"\
"UTISkZkEiq2vfffCYZLVE0qiUTufzzRFhHx+gkNKIU6jVP6wuu1m5eMbleg3S7FL\n"\
"GmFYE1uvnL/N7aEa/gyQKlDq2+PtqSf7aRybdJ273sfLLyadghMSqNMjnA028JcQ\n"\
"E8VEqdEhtWSZFUN2BqEYHhofD8GHdVESMa6NxoFMaQb0yMRAZm4qbRHZv2LK7Gmb\n"\
"GphuLv9gNPsDu0SbY1pbUZeUmXjWlnzRvk/T+CY59EfR+Tt8A7vBx+mGoCwmtwSc\n"\
"2VHMElhItOlF3QIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQCdltc4R7M2+9HKwKOd\n"\
"kJJ159iCTPIi/V3epO4uBiFquQrMog6HQktkMSxovlCNkjC8MsMC+uXnCrDqvfBq\n"\
"Temtg2ZW4Gz/00f3pI5gyCkXtm6YHQkYJXS34xYKTlu+OX0mCBm7lPwzR7I9doQF\n"\
"9zZ/HwJydtWbt5MUOrFC2P2edFTvO25dSOeNLvbA/KMTzyGeZxYhz22nes37xwNz\n"\
"iIG0qnxktRIW9uVcA18U0j4eI9Hh1g23tmvVFoV7GZV/VHqPpSa8vpzXuo1Z4+Y3\n"\
"5Kh5IyNQ1sQl9DETsyeiOnVKmxVpTgi0uXrrjeyWWJhwRsK4qxG1ruLbHQwF6m4f\n"\
"yMBK\n"\
"-----END CERTIFICATE-----\n";



#define TEMPC_TOPIC    "DHT/tempC"
#define  HUM_TOPIC     "DHT/humidity"

 
int status = WL_IDLE_STATUS;

WiFiClientSecure wifiClient;
PubSubClient client(wifiClient);
#define DHTPIN 15
#define DHTTYPE DHT22
#define MQTT_PORT_UN_SECURE 1883
#define MQTT_PORT_SECURE 8883

AsyncMqttClient mqttClient;

DHT dht(DHTPIN, DHTTYPE);
unsigned long readTime;
 
float tempC = 0.0;
float cToFRate = 1.8;
float cToF32 = 32;
float humidity = 0.0;



void connectToMqtt() {
  Serial.println("Connecting to MQTT...");
  mqttClient.connect();
}

void onMqttConnect(bool sessionPresent) {
  Serial.println("Connected to MQTT.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);
}
 
void setup() {
  Serial.begin(115200);
  delay(10);
  Serial.print("Attempting to connect to SSID: ");
  Serial.println(ssid);

 wifiClient.setCACert(ca_cert);
 wifiClient.setCertificate(client_cert); // for client verification
 wifiClient.setPrivateKey(client_key);  // for client verification

  mqttClient.onConnect(onMqttConnect);
  mqttClient.setServer(mqtt_server, MQTT_PORT_UN_SECURE);
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
 
  delay(100);
 
  connectWifi();

}
 
void loop() {
  if(WiFi.status() != WL_CONNECTED){
    connectWifi();
  } else {
    if(!client.connected()){
      initMQTT();
      connectToMqtt();
      sensorRead();

      
    } else {
      sensorRead();


    }
  }
  client.loop();
  delay(3000);
}
 
void initMQTT(){
  Serial.println("Initializing MQTT Secure");
   
  randomSeed(micros());
  client.setServer(mqtt_server, MQTT_PORT_SECURE);
  connectMQTT();
}

void initMQTT2(){
  Serial.println("Initializing MQTT");
   
  randomSeed(micros());
  client.setServer(mqtt_server, 1883);
  connectMQTT();
}
 
void connectMQTT(){
   
  while(!client.connected()){
    String clientId = "Client-";
    clientId += String(random(0xffff), HEX);

    //Mqtt username and password
    if(client.connect(clientId.c_str())){
      Serial.println("Successfully connected MQTT");
    } else {
      Serial.println("Error!");
      Serial.println(client.state());
      delay(60000);
    }
  }
}
 
void sensorRead(){
  readTime = millis();
 // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht.readTemperature(true);

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Compute heat index in Fahrenheit (the default)
  float hif = dht.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  float hic = dht.computeHeatIndex(t, h, false);

  char buffer[10];
  dtostrf(t,0, 0, buffer);
  client.publish("esp32/dht/temperature",buffer);
  mqttClient.publish("esp32/dht/temperature", 1, true,  String(buffer).c_str());
  //Serial.println(buffer);
  dtostrf(h,0, 0, buffer);
  client.publish("esp32/dht/humidity",buffer);
  mqttClient.publish("esp32/dht/humidity", 1, true, String(buffer).c_str());
  Serial.println("Published new data to MQTT Broker!");
  
  //client.publish("inTopic/humidity",sprintf(buf, "%f", h));
  /*Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.print(" *C ");
  Serial.print(f);
  Serial.print(" *F\t");
  Serial.print("Heat index: ");
  Serial.print(hic);
  Serial.print(" *C ");
  Serial.print(hif);
  Serial.println(" *F"); */
}
 
void connectWifi(){
  WiFi.begin(ssid, password);
 
   
  while(status != WL_CONNECTED){
    status = WiFi.status();
     dht.begin();
    delay(1000);
    Serial.print(".");
  }
}
 
float convertCtoF(float t){
  return ((t * cToFRate) + cToF32);
}
