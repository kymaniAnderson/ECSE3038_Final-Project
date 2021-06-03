// VARIABLE DECLARATIONS:
var connectionURL = "http://172.16.188.48:5000"
var incomingPos = ""
var incomingID = ""

function createPatientCard(patient, pos){
    //START: Card Body as DIV:
    var patientCardDiv = document.createElement("DIV");
    patientCardDiv.classList.add("card-body");
    
    //START: Card Content as A:
    var patientCardContent = document.createElement("A");
    patientCardContent.classList.add("card-content");
    patientCardContent.setAttribute("onclick", "goToGraph('".concat(patient.patient_id).concat("')"));

    //Patient Name as H3, SPAN:
    var patientName = document.createElement("H3");
    patientName.classList.add("card-name");

    var nameValue1 = document.createElement("SPAN");
    nameValue1.innerHTML = patient.lname.toUpperCase().concat(", ");

    var nameValue2 = document.createElement("SPAN");
    nameValue2.innerHTML = patient.fname;

    patientName.append(nameValue1);
    patientName.append(nameValue2);
    
    //Patient Position as H4, I, H5:
    var patientPositionLabel = document.createElement("H4");
    patientPositionLabel.classList.add("card-label");
    patientPositionLabel.innerHTML = "Position:";

    var patientPositionIcon = document.createElement("I");
    patientPositionIcon.setAttribute("id", "patientPositionIcon:".concat(patient.patient_id));

    if (pos === "Standing") {
        patientPositionIcon.classList.add("fas", "fa-male");
    } else{
        patientPositionIcon.classList.add("fas", "fa-bed");
    }
    
    var patientPosition = document.createElement("H5");
    patientPosition.setAttribute("id", "patientPosition:".concat(patient.patient_id))
    patientPosition.classList.add("card-position");
    patientPosition.innerHTML = pos; 

    //END: Card Content as DIV:
    patientCardContent.append(patientName);
    patientCardContent.append(patientPositionLabel);
    patientCardContent.append(patientPositionIcon);
    patientCardContent.append(patientPosition);

    //START: Card NavBar as NAV:
    var patientCardNav = document.createElement("NAV");
    patientCardNav.classList.add("card-nav");

    //Card Buttons as UL, LI, DIV, SPAN:
    var ul = document.createElement("UL");
    var li1 = document.createElement("LI");
    var li2 = document.createElement("LI");

    //Delete:
    var btn1 = document.createElement("DIV");
    btn1.classList.add("btn");
    btn1.setAttribute("onclick", "delFunc('".concat(patient.patient_id).concat("')"));

    var btn1Span1 = document.createElement("SPAN");
    var i1 = document.createElement("I");
    i1.classList.add("far", "fa-window-close");
    btn1Span1.append(i1);

    var btn1Span2 = document.createElement("SPAN")
    btn1Span2.classList.add("hidden-message");
    btn1Span2.innerHTML = "Delete";
    btn1.append(btn1Span1);
    btn1.append(btn1Span2);

    //Edit:
    var btn2 = document.createElement("DIV");
    btn2.classList.add("btn");
    btn2.setAttribute("onclick", "toggleForm('".concat(patient.patient_id).concat("')"));

    var btn2Span1 = document.createElement("SPAN");
    var i2 = document.createElement("I");
    i2.classList.add("far", "fa-edit");
    btn2Span1.append(i2);

    var btn2Span2 = document.createElement("SPAN");
    btn2Span2.classList.add("hidden-message");
    btn2Span2.innerHTML = "Edit";
    btn2.append(btn2Span1);
    btn2.append(btn2Span2);

    li1.append(btn1);
    li2.append(btn2);
    ul.append(li1);
    ul.append(li2);

    //END: Card NavBar as NAV:
    patientCardNav.append(ul);
  
    //END: Card Body as BUTTON:
    patientCardDiv.append(patientCardContent);
    patientCardDiv.append(patientCardNav);

    return patientCardDiv;
}

function toggleForm(id){
    var blur = document.getElementById("blur");
    blur.classList.toggle("active");
    var popup = document.getElementById("popup");
    popup.classList.toggle("active");

    var submit = document.getElementById("submit");
    submit.classList.add("".concat(id));

    console.log("PATCH: ".concat(id));
}

function getPatients(){
    return fetch(connectionURL.concat("/api/patient"))
    .then((res) => res.json())
    .then((json) => json);
}

function getRecord(patient_id){
    return fetch(connectionURL.concat("/api/record/").concat(patient_id))
    .then((res) => res.json())
    .then((json) => json);
}

async function getPosition(patient_id){
    let record = await getRecord(patient_id);
    console.log(record.position);
    return record.position;
}

async function drawCard(){
    let patients = await getPatients();
    console.log(patients);

    patients.forEach((patient) => {
        getPosition(patient.patient_id).then((pos) => {
            var container = document.querySelector(".container");
            container.append(createPatientCard(patient, pos));
        });
    });
}

window.onload = function() {
  drawCard();
};

function delFunc(id){
    var funcPath = connectionURL.concat("/api/patient/").concat(id);

    return fetch(funcPath, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
        }
    });
}

function goToGraph(id){
    sessionStorage.setItem("patient_id", id);
    window.location.href = "/client/templates/patientProfile.html";
}

document.getElementById("submit").addEventListener("click", function(event){
    let patient_id = document.getElementById("patient_id").value;
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let age = document.getElementById("age").value;

    jsonBody = {};
    
    if (patient_id !== "") jsonBody["patient_id"] = patient_id;
    if (fname !== "") jsonBody["fname"] = fname;
    if (lname !== "") jsonBody["lname"] = lname;
    if (age !== "") jsonBody["age"] = age;

    var id = document.getElementById("submit").className;

    var funcPath = connectionURL.concat("/api/patient/").concat(id);
    fetch(funcPath, {
        method: "PATCH",
        body: JSON.stringify(jsonBody),
        headers: {
            "Content-type": "application/json",
        },
    })
    .then((res) => res.json)
    .then((json) => console.log(json));

    toggleForm("123");
});

var eventSource = new EventSource(connectionURL.concat("/listen"))
eventSource.addEventListener("message", function(e){
    console.log(e.data)
}, false)

var eventSource = new EventSource(connectionURL.concat("/listen"))
eventSource.addEventListener("online", function(e){
    data = JSON.parse(e.data);
    incomingPos = data.position;
    incomingID = data.patient_id;

    iconID = document.getElementById("patientPositionIcon:".concat(incomingID));
    labelID = document.getElementById("patientPosition:".concat(incomingID));
    
    try{
        //change the icon:
        if (incomingPos === "Standing") {
            iconID.setAttribute("class", "fas fa-male");
        } else{
            iconID.setAttribute("class", "fas fa-bed");
        }

        //change the label:
        labelID.innerHTML = incomingPos;
    }
    catch(err){
    }
}, true)