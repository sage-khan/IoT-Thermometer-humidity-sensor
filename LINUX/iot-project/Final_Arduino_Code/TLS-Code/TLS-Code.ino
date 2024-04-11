
#include <PubSubClient.h>
#include<WiFiClientSecure.h>
#include <AsyncMqttClient.h>
#include<WiFi.h>
#include <DHT.h>
 
#define DHT11PIN 23
 
const char* ssid = "Redmi 9C";
const char* password = "554270554270";
const char* mqtt_server = "192.168.43.126";

//const char* mqtt_user = "admin";
//const char* mqtt_pass ="admin";

const char* ca_cert= \
"-----BEGIN CERTIFICATE-----\n"\
"MIIDuzCCAqOgAwIBAgIUZciJAGPyz7ITT58O0HvCky3zkNwwDQYJKoZIhvcNAQEL\n"\
"BQAwbTELMAkGA1UEBhMCU0UxEjAQBgNVBAgMCVN0b2NraG9sbTESMBAGA1UEBwwJ\n"\
"U3RvY2tob2xtMRAwDgYDVQQKDAdoaW1pbmRzMQswCQYDVQQLDAJDQTEXMBUGA1UE\n"\
"AwwOMTkyLjE2OC40My4xMjYwHhcNMjIwMTEzMTEzMjQzWhcNMjMwMTEzMTEzMjQz\n"\
"WjBtMQswCQYDVQQGEwJTRTESMBAGA1UECAwJU3RvY2tob2xtMRIwEAYDVQQHDAlT\n"\
"dG9ja2hvbG0xEDAOBgNVBAoMB2hpbWluZHMxCzAJBgNVBAsMAkNBMRcwFQYDVQQD\n"\
"DA4xOTIuMTY4LjQzLjEyNjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB\n"\
"ALcVKEvjd+ks41Cv/2dyUz8yuCo7x5O8rCEp2pS6/D379AlweVgnBdY6ufuuDxFP\n"\
"pf99o4HL5Y6Vi8Sx+Qh1mS3uizhlAhV2C1TpN9tM0zqAyPPeTOeuojyaZiDig2Le\n"\
"Ch8KZ3tlYB0u/1tze23Cyj2PBKRBbT5ySdLau4KZu6lTUBWPDbms4vytIB4JfoAr\n"\
"2Bc5wAE6umASqCrIf0trqt+9gxamEWH5K6zrhRXhTJfnX16VQT+jouvHqXNekbId\n"\
"tRkJIFxFRvgBRKkgTHJb07yd/ue9ewpmZBI5BleVI1TwoR48XBHz7piNlVxVBdoI\n"\
"CLGLUDsaFo6mRPHdSuCWK4UCAwEAAaNTMFEwHQYDVR0OBBYEFGvvx5xQuOci2Q1H\n"\
"PYzY78yMoDFzMB8GA1UdIwQYMBaAFGvvx5xQuOci2Q1HPYzY78yMoDFzMA8GA1Ud\n"\
"EwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAFsEPCJe7RFr0LXpyd1mIjib\n"\
"7FE3hL3Z/rOdtiiouo5cncPsexYQN//IBHjZdMlLg0NEG6Z9a90oLRmpPFHaal2Q\n"\
"BoP7rP46mY10aOyhjMVaqTyOo+Wl431gQXstXoPBRSp1TEk+YuYsrK76SvtgiI8j\n"\
"/9JVD+Wel2PX39fgYTUatSo9SCBRZTaOpfMM6GjNVgL1NF2y/y9SBh5r6iC+JkXk\n"\
"wJQj0yQT8FWMN76uZpbq7uQmJDOkSz3df/OI6IQ9Dm/m3MsZC5MJdMpDsxU+/ogF\n"\
"+2Eczri4SQdO372WKJZC+X/JHTXJtpnSKARVqYnDMnCmVe/qAveCYSwl7RBTJjQ=\n"\
"-----END CERTIFICATE-----\n";

const char* client_key = \
"-----BEGIN PRIVATE KEY-----\n"\
"MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDOpbbbSGIcQZgK\n"\
"DQpMPKSkv+cupsodJmBjg+V6EK5rt114ru1F7XsVn/hNjnrtav0USQGN6Nwo3piG\n"\
"uw3yFFEi2llzDotVZZ0UMhXi/jPbDqCyHtDEjahHPKIvKSsiKaqYLpgWpeXd25vt\n"\
"+96QRFfYguM4w0t+7aNPwUmSpPXzxYoFxMqM+lwypGmZaopjlPJmtiZi44c/JCOI\n"\
"n1Lf9QQZIkEHP9iuhvqz45+KTMSODKK9+N6/Qqg254FJchj40UR5FMKhZotR+c+y\n"\
"eDibSbv+lIoEDMfsPSEnlS0mZsGNV1IEAgg+1nIblGHl8ijfb/E0r5F0UXRah78i\n"\
"ULkNdm0hAgMBAAECggEAFGabxM5CkVOQdP2QlLIv9uvTIPHqZjJRtcFhuElJTu0N\n"\
"V0q9tfeZ/SqL0uxMCoBTd9s1QhNJGOfQ2wxAdjO3Rt+TkR5Qdx/PAB1pt70s1WV+\n"\
"S9dq+NybTl0YDdvcnETMyLVg4muCZAK4RChncoqsuX1CfWoaW++N/eOxJb8PYP9j\n"\
"5j4Hx3KtH791NUOfYAJqPP5Pvv9DucUS0xudh1dfphZvFfOILhuYREuhTt8SWZ0u\n"\
"Ss0JDfotvPfiMtvVoRH+2jcI6snXaKs+ujFzCv7AYcPmgyz55pVtFp3sizyyMxMy\n"\
"4mL+VcnRL5Ft+6TwsDBrC65v4YQHrv8Q12slT0eKGQKBgQD7kHDsPHyDrAYXZk8U\n"\
"9o85CuWeL7vON0Z1ZhnAiP12uPtx2SmZzpZfr4KQBFAsAWE+yNHXNMnjc1NhsZGZ\n"\
"pEq/kIljOLoUttgwZmrZnXZuRR112t1X5FYs1YxOeDcw7nseqaJecrfDvV9RsSmb\n"\
"Vf2DlgiulWykXm4hdYxKWCalZwKBgQDSSoTFzaoPMOSN/ymE82anayUY9tCRL2bL\n"\
"9hwjrAA3xf6QA/aB6nlBhTbRio+82Fcx8gOA+OUJK39Dzrc/v9i+MYLICBmAtwo4\n"\
"61fJpa2AgiOUtjkg6e/UlfiZ8hz9mQcsFsw1CwaV8JTptE/H0HdJIoKo8jTFGky+\n"\
"QlT7eL18NwKBgEab/UYhmCVxNGh++/V7Wyn8qASli0ZPd4ReOx4ylUosk88Z0DZu\n"\
"qQCEh9Yaj9I6NOxle5i3JW+lICNMrvx8A8sPK7Dg7EICLF4xcQ5RxzseRS2eWABi\n"\
"g9mjuvUPgxZF6eLqZDu0YWYcklOgsXf7Q+QaSaePI2ZjZvAXSWBYq8hDAoGAGkra\n"\
"4uhd9NxGF0Lp7AeKtC//SWnClgR5M9MnnYYp2M9WjqcQMRoh4wFG41gRtKjP7hy2\n"\
"N2/nIwhfNxknbD8OWGlUUrJAjglUq90w8rNWSBT9YeCOsADPzaKanJTa7xItBWQs\n"\
"UA1621BjLf0vZGo6H9jCwWDXHDW3lqoweeiUuG0CgYBPi6BJRAFdPfVRuTmJReVf\n"\
"kAXhrD0NULACHxYEZ0GNIXrE0Z+HKatwFuO5vHGutG2hrzGYx1ZIEVGMviyvSgvE\n"\
"MOqOug2iPgLlvMCLAX4ZqAG/uoX3mwc8wKWBu5EC7ub9+P/qXfB3AFiBD70FDE+8\n"\
"6ZwQr+QWquE6UijxeBTXDQ==\n"\
"-----END PRIVATE KEY-----\n";


const char* client_cert = \
"-----BEGIN CERTIFICATE-----\n"\
"MIIDZTCCAk0CFGcngTJJ0dpyF0AyJORcRaHWd90BMA0GCSqGSIb3DQEBCwUAMG0x\n"\
"CzAJBgNVBAYTAlNFMRIwEAYDVQQIDAlTdG9ja2hvbG0xEjAQBgNVBAcMCVN0b2Nr\n"\
"aG9sbTEQMA4GA1UECgwHaGltaW5kczELMAkGA1UECwwCQ0ExFzAVBgNVBAMMDjE5\n"\
"Mi4xNjguNDMuMTI2MB4XDTIyMDExMzExMzI0M1oXDTIzMDExMzExMzI0M1owcTEL\n"\
"MAkGA1UEBhMCU0UxEjAQBgNVBAgMCVN0b2NraG9sbTESMBAGA1UEBwwJU3RvY2to\n"\
"b2xtMRAwDgYDVQQKDAdoaW1pbmRzMQ8wDQYDVQQLDAZDbGllbnQxFzAVBgNVBAMM\n"\
"DjE5Mi4xNjguNDMuMTI2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\n"\
"zqW220hiHEGYCg0KTDykpL/nLqbKHSZgY4PlehCua7ddeK7tRe17FZ/4TY567Wr9\n"\
"FEkBjejcKN6YhrsN8hRRItpZcw6LVWWdFDIV4v4z2w6gsh7QxI2oRzyiLykrIimq\n"\
"mC6YFqXl3dub7fvekERX2ILjOMNLfu2jT8FJkqT188WKBcTKjPpcMqRpmWqKY5Ty\n"\
"ZrYmYuOHPyQjiJ9S3/UEGSJBBz/Yrob6s+OfikzEjgyivfjev0KoNueBSXIY+NFE\n"\
"eRTCoWaLUfnPsng4m0m7/pSKBAzH7D0hJ5UtJmbBjVdSBAIIPtZyG5Rh5fIo32/x\n"\
"NK+RdFF0Woe/IlC5DXZtIQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBULhEnE2zr\n"\
"D+EHiMoNwlrGQDHfwPCvQbzM0+scIiFv74BizIRGAtkgvnpbdshL+mJ8Uche/4IU\n"\
"YdsjOkGkI6eCrcEaGO+lK+hICZpes9vwzx7W2r4XOqHuUmvEbTFfsG2KGlb9JMnE\n"\
"nFgal63V9XPMVj7wzlkRYbvGM/6VMOyThkMp1FYxn8Ixd0fnkQ/Ap2cWWcdrkqZT\n"\
"4Wm5D5Cy5RsUWypwli2q/74MhPj8js4qSwEUawqeOrmNe/9KgG8tOFqPFuEJIxKu\n"\
"gUmaAlXF7lrMKkuoi9m9i5Wyi5SirRCaix8OerIgiCpVt134spmPQs4c+WwDROj0\n"\
"NfEEZB7zuNSB\n"\
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
