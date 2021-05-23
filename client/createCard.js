function createPatientCard(patient, pos){
    //START: Card Body as BUTTON:
    var patientCardButton = document.createElement("BUTTON");
    patientCardButton.classList.add("card-body");
    patientCardButton.setAttribute("onclick", "location.href='api/patient/".concat(patient.patient_id).concat("'"))
    
    //START: Card Content as DIV:
    var patientCardContent = document.createElement("DIV");
    patientCardContent.classList.add("card-content");

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

    if (pos === "Standing") {
        patientPositionIcon.classList.add("fas", "fa-male");
    } else{
        patientPositionIcon.classList.add("fas", "fa-bed");
    }
    
    var patientPosition = document.createElement("H5");
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

    //Card Buttons as UL, LI, A, SPAN:
    var ul = document.createElement("UL");
    var li1 = document.createElement("LI");
    var li2 = document.createElement("LI");

    //A1 Delete:
    var a1 = document.createElement("A");
    a1.setAttribute("href", "/deleteUser/".concat(patient.patient_id));

    var a1Span1 = document.createElement("SPAN");
    var i1 = document.createElement("I");
    i1.classList.add("far", "fa-window-close");
    a1Span1.append(i1);

    var a1Span2 = document.createElement("SPAN")
    a1Span2.classList.add("hidden-message");
    a1Span2.innerHTML = "Delete";
    a1.append(a1Span1);
    a1.append(a1Span2);

    //A2 Edit:
    var a2 = document.createElement("A");
    a2.setAttribute("href", "/editUser/".concat(patient.patient_id));

    var a2Span1 = document.createElement("SPAN");
    var i2 = document.createElement("I");
    i2.classList.add("far", "fa-edit");
    a2Span1.append(i2);

    var a2Span2 = document.createElement("SPAN");
    a2Span2.classList.add("hidden-message");
    a2Span2.innerHTML = "Edit";
    a2.append(a2Span1);
    a2.append(a2Span2);

    li1.append(a1);
    li2.append(a2);
    ul.append(li1);
    ul.append(li2);

    //END: Card NavBar as NAV:
    patientCardNav.append(ul);
  
    //END: Card Body as BUTTON:
    patientCardButton.append(patientCardContent);
    patientCardButton.append(patientCardNav);

    return patientCardButton;
}

function delFunc(patient_id){
    var funcPath = "/api/patienhhhht/".concat(patient_id);

    return fetch(funcPath, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
        }
    });
}

function getPatients(){
    return fetch("http://192.168.100.76:5000/api/patient")
    .then((res) => res.json())
    .then((json) => json);
}

function getRecord(patient_id){
    return fetch("http://192.168.100.76:5000/api/record/".concat(patient_id))
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