#include <Arduino.h>
#include <SoftwareSerial.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

Adafruit_MPU6050 mpu;

#define RX 10
#define TX 11
#define DEBUG true
#define TIMEOUT 3000
#define TEMP_PIN 0

String ID = "Digicel_WiFi_dHNK";
String PW = "eYPXjQ29";
String HOST = "192.168.100.82";
int PORT = 5000;

int tankID = 0;

SoftwareSerial espSerial(RX, TX); // RX, TX

String sendData(String command, const int timeout, boolean debug);
int getAccel();
int getTemp();

void setup() {
  espSerial.begin(115200);
  Serial.begin(115200);

  //ESP Stuff:
  sendData("AT+RST", TIMEOUT, DEBUG);
  String SETUP = "AT+CWJAP=";
  SETUP.concat("\"" + ID + "\",\"" + PW + "\"");
  sendData(SETUP, TIMEOUT, DEBUG);

  //GYRO Stuff:
  while (!Serial)
    delay(10);

  //initialize!
  if (!mpu.begin()){
    Serial.println("MPU6050 NOT FOUND!");
    
    while (1){
      delay(10);
    }
  }
  Serial.println("MPU6050 FOUND!");
  
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);  //+-2G, +-4G, +-8G, +-16G
}

void loop() {  
  String START = "AT+CIPSTART=\"TCP\",";
  START.concat("\"" + HOST + "\"," + PORT);
  sendData(START, TIMEOUT, DEBUG);

  tankID ++;

  String BODY = "{\"tank_id\":" + String(tankID) + ", \"temp\":" + String(getTemp()) + "}\r\n" + ", \"accel\":" + getAccel() + "}\r\n";
  
  String POST = "POST /tank HTTP/1.1\r\n";                              //line 1
  POST.concat("Host: " + HOST + ":" + PORT + "\r\n");                   //line 2
  POST.concat("Content-Type: application/json\r\n");                    //line 3 
  POST.concat("Content-Length: " + String(BODY.length()) + "\r\n\r\n"); //line 4
  POST.concat(BODY);                                                    //line 5
  

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
  int temp = temp * 0.48828125;
  return temp;                   
}

int getAccel(){
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  
  int val = sq(a.acceleration.x) + sq(a.acceleration.y) + sq(a.acceleration.z);
  int accel = sqrt(val);
  
  return accel;
}