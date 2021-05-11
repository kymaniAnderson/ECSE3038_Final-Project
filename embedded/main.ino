#include <Arduino.h>
#include <SoftwareSerial.h>
#include <MPU6050.h>
#include <Wire.h>

MPU6050 mpu;

#define RX 10
#define TX 11
#define DEBUG true
#define TIMEOUT 3000
#define TEMP_PIN A0

String ID = "Nicho";
String PW = "15532E&w";
String HOST = "192.168.137.31";
int PORT = 5000;

int16_t gx, gy, gz;

SoftwareSerial espSerial(RX, TX); // RX, TX

String sendData(String command, const int timeout, boolean debug);
String getMacAddress();
String getPos();
int getTemp();

void setup(){
  espSerial.begin(115200);
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

  String BODY = "{\"patient_id\":" + getMacAddress() + ", \"position\":" + getPos() + "}\r\n" + ", \"temperature\":" + String(getTemp()) + "}\r\n";
  
  String POST = "POST /tank HTTP/1.1\r\n";                              //line 1
  POST.concat("Host: " + HOST + ":" + PORT + "\r\n");                   //line 2
  POST.concat("Content-Type: application/json\r\n");                    //line 3 
  POST.concat("Content-Length: " + String(BODY.length()) + "\r\n\r\n"); //line 4
  POST.concat(BODY);                                                    //line 5
  Serial.println(POST);

  String SEND = "AT+CIPSEND=";
  SEND.concat(POST.length());
  sendData(SEND, TIMEOUT, DEBUG);

  sendData(POST, TIMEOUT, DEBUG);
}

String sendData(String command, const int timeout, boolean debug){
  command.concat("\r\n"); //Simulate enter btn
  String response = "";
  espSerial.print(command);

  long unsigned int time = millis();

  while((time + timeout) > millis()){
      while(espSerial.available()){
          char c = espSerial.read();
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
    
  if (gy > 2.0){
    pos = "Upright";
  }
  else{
    pos="Resting";
  }
  
  return pos;
}

String getMacAddress(){//TODO
  String res = "";
  String SETUP = "AT+CIPSTAMAC?\r\n";
  res = sendData(SETUP, TIMEOUT, DEBUG);
  
  return res;
}