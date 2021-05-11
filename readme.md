# Simple Patient Monitoring System
  
## Aim
The aim of this project is to build a prototype for a low cost patient monitoring system.
  
## Hardware Requirements 
1. ESP8266 Module
2. LM35 - Temperature Sensor
3. MPU6050 - Gyroscope
  
## Software Requirements
See the `requirements.txt` folder.
   
### Embedded 

The embedded side consists of a sketch that makes the microcontroller send POST requests with the values measured from the gyroscope sensor and the temperature sensor. The MAC address of the ESP8266 is sent as the patient ID.

### Backend

The backend consists of 6 url endpoints:

- POST /api/record

    This route handles the incoming requests from the emebedded system.

    ```json
    {
    	"position": <position>,
       "temperature": <temperature>,
       "last_updated": <last_updated>,
       "patient_id": <patient_id>
    }
    ```

- GET /api/patient

    This route returns an array of all patient objects stored in the database.

- POST /api/patient

    This route handles the creation of a new patient object. The parameters of this object should be taken from the JSON body of the incoming request.

    ```json
    {
    	"fname": <first name>,
    	"lname": <last name>,
      "age": <age>,
    	"patient_id": <mac address>
    }
    ```

- GET /api/patient/:id

    This route returns a single patient object. The patient returned should have an ID that matches the one specified in the request.

- PATCH /api/patient/:id

    This route allows a user to edit any of the details of a specified patient object identified by their ID. The route should respond with the newly edited patient object.

- DELETE /api/patient/:id

    This route allows a user to delete a specified patient object identified by their ID. The route should respond with a message that indicates weather the operation was successful.

### Database

A mongoDB database was setup to store 2 seperate objects:
1. A "patient" object - stores data inputted by user on the frontend.
2. A "record" object - stores data from embedded system

### Frontend

The frontend consists of two views:

1. A main page where a grid of patient cards are displayed. Each card shows the patient's first and last name and their current position. 

    Each card should also has an edit and delete button. When the edit button is pressed, the view is modified to accommodate new values to be sent to the backend in a PATCH request for the patient object. When the delete button is clicked, a DELETE request is sent to the backend to remove the specified patient object.

2. A secondary page that shows the details of a single patient. This view is shown if a user clicks on one of the patient cards from the main view. This new view only shows the details of the patient in focus. The patient's first and last name is displayed along with their current position, their current temperature in numerical form as well as a graph of the patients temperature over time.

   
