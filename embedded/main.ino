#include <MPU6050.h>
#include <Wire.h>

MPU6050 mpu;

#define RX 10
#define TX 11
#define DEBUG true
#define TIMEOUT 5000
#define TEMP_PIN A0

String ID = "Digicel_WiFi_dHNK";
String PW = "eYPXjQ29";
String HOST = "192.168.100.71";
int PORT = 5000;

int16_t gx, gy, gz;

String sendData(String command, const int timeout, boolean debug);
String getMacAddress();
String getPos();
int getTemp();

void setup(){
  Serial1.begin(115200);
  Serial.begin(115200);

  /*******   ESP Setup   *******/
  // 1. Reset:
  sendData("AT+RST", TIMEOUT, DEBUG);
  
  // 2. Config SoftAP + Station Mode:
  sendData("AT+CWMODE=3", TIMEOUT, DEBUG);

  // 3. Join Access-point:
  String SETUP = "AT+CWJAP=";
  SETUP.concat("\"" + ID + "\",\"" + PW + "\""); 
  sendData(SETUP, TIMEOUT, DEBUG);

  /*******   GYRO Setup   *******/
  // 1. Initialize:
  Serial.println("Initializing MPU6050...");
  mpu.initialize();

  // 2. Test Connection:
  Serial.println("Testing MPU6050...");
  Serial.println(mpu.testConnection() ? "MPU6050 connection successful" : "MPU6050 connection failed");
}

void loop() {  
  String START = "AT+CIPSTART=\"TCP\",";
  START.concat("\"" + HOST + "\"," + PORT);
  sendData(START, TIMEOUT, DEBUG);

  String BODY = "{\"patient_id\": \"" + getMacAddress() + "\", \"position\": \"" + getPos() + "\", \"temperature\": " + String(getTemp()) + "}\r\n";
  
  String POST = "POST /api/record HTTP/1.1\r\n";                              //line 1
  POST.concat("Host: " + HOST + ":" + PORT + "\r\n");                   //line 2
  POST.concat("Content-Type: application/json\r\n");                    //line 3 
  POST.concat("Content-Length: " + String(BODY.length()) + "\r\n\r\n"); //line 4
  POST.concat(BODY);                                                    //line 5
  Serial.println(POST);

  String SEND = "AT+CIPSEND=";
  SEND.concat(String(POST.length()));
  sendData(SEND, TIMEOUT, DEBUG);

  sendData(POST, TIMEOUT, DEBUG);
}

String sendData(String command, const int timeout, boolean debug){
  command.concat("\r\n"); //Simulate enter btn
  String response = "";
  Serial1.print(command);

  long unsigned int time = millis();

  while((time + timeout) > millis()){
      while(Serial1.available()){
          char c = Serial1.read();
          response += c;
        }
    }

   if(debug){
      Serial.print(response); 
    }

  return(response);
}

int getTemp(){
  int snsrRead = analogRead(TEMP_PIN);
  int temp = snsrRead * 0.48828125;
  
  return temp;                   
}

String getPos(){//TODO
  mpu.getRotation(&gx, &gy, &gz);
  String pos;
    
  if (gy > 1.0){
    pos = "Upright";
  }
  else{
    pos="Resting";
  }
  
  Serial.print("Sent Position: \t");
  Serial.println(pos);
  Serial.print("Sent Gyro: \t");
  Serial.println(gy);
  
  return pos;
}

String getMacAddress(){
  String res = "";
  String SETUP = "AT+CIPSTAMAC?\r\n";
  res = sendData(SETUP, TIMEOUT, DEBUG);
  
  String macAddr = res.substring(42, 59);
  
  return macAddr;
}