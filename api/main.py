from gevent import monkey; monkey.patch_all()
from flask import Flask, request, jsonify, Response, stream_with_context
from gevent.pywsgi import WSGIServer
from flask_pymongo import PyMongo
from marshmallow import Schema, fields, ValidationError
from bson.json_util import dumps
from flask_cors import CORS
from json import loads
import json
import datetime
import time

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://admin:nQwPMWWOpPebXEwD@cluster0.41j7h.mongodb.net/patientsDB?retryWrites=true&w=majority"
mongo = PyMongo(app)

db_operations_patients = mongo.db.patients
db_operations_records = mongo.db.records
dte = datetime.datetime.now()

class PatientSchema(Schema):
    fname = fields.String(required=True)
    lname = fields.String(required=True)
    age = fields.Integer(required=True)
    patient_id = fields.String(required=True)

class RecordSchema(Schema):
    position = fields.String(required=True)
    temperature = fields.Integer(required=True)
    last_updated = fields.String(required=True)
    patient_id = fields.String(required=True)

incomingPos = ""
incomingID = ""

# ROUTE 1:
@app.route("/api/patient", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        # /POST
        try: 
            fname = request.json["fname"]
            lname = request.json["lname"]
            age = request.json["age"]
            patient_id = request.json["patient_id"]

            jsonBody = {
                "fname": fname,
                "lname": lname,
                "age": age,
                "patient_id": patient_id
            }
            
            newPatient = PatientSchema().load(jsonBody)
            db_operations_patients.insert_one(newPatient)

            return {
                "sucess": True,
                "message": "Patient saved to database successfully!"
            }, 200

        except ValidationError as err1:
            return {
                "sucess": False,
                "message": "An error occured while trying to post patient"
            }, 400
    else:
        # /GET
        patients = db_operations_patients.find()

        return  jsonify(loads(dumps(patients))), 200

# ROUTE 2:
@app.route("/api/patient/<path:id>", methods=["GET", "PATCH", "DELETE"])
def patientProfile(id):
     
    filt = {"patient_id" : id}

    if request.method == "PATCH":
        # /PATCH
        updates = {"$set": request.json}
        db_operations_patients.update_one(filt, updates)      
        updatedPatient = db_operations_patients.find_one(filt)

        return  jsonify(loads(dumps(updatedPatient)))

    elif request.method == "DELETE":
        # /DELETE
        tmp = db_operations_patients.delete_one(filt)
        result = {"sucess" : True} if tmp.deleted_count == 1 else {"sucess" : False}
       
        return result

    else:
        # /GET
        patient = db_operations_patients.find_one(filt)

        return  jsonify(loads(dumps(patient)))

# ROUTE 3:
@app.route("/api/record", methods=["POST"])
def postPatientData():
    try:
        position = request.json["position"]
        temperature = request.json["temperature"]
        last_updated = dte.strftime("%c")
        patient_id = request.json["patient_id"]

        global incomingPos, incomingID
        incomingPos = position
        incomingID = patient_id

        jsonBody = {
            "position": position,
            "temperature": temperature,
            "last_updated": last_updated,
            "patient_id": patient_id
        }

        newRecord = RecordSchema().load(jsonBody)
        db_operations_records.insert_one(newRecord)

        return{
            "success": True,
            "message": "Record saved to database successfully"
        }, 200

    except ValidationError as err2:
        return{
            "success": False,
            "message": "An error occured while trying to post record"
        }, 400

# ROUTE 4:
@app.route("/api/record/<path:id>", methods=["GET"])
def getPatientData(id):
    filt = {"patient_id" : id}
    srt = ("last_updated", -1)

    # /GET
    record = db_operations_records.find_one(filt)
    return  jsonify(loads(dumps(record)))

# ROUTE Listen:
@app.route("/listen")
def listen():
    def respondToClient():
        while True:
            global incomingPos, incomingID

            jsonBody = {
                "position": incomingPos,
                "patient_id": incomingID
            }

            data = json.dumps(jsonBody)
            yield f"id: 1\ndata: {data}\nevent: online\n\n"
            time.sleep(0.5)
        
    return Response(respondToClient(), mimetype='text/event-stream')
            


# Main
if __name__ == '__main__':
    http_server = WSGIServer(("172.16.188.215", 5000), app)
    http_server.serve_forever()
    # app.run(debug = True, host="192.168.100.76", port=5000)