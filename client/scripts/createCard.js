function createPatientCard(patient, pos){
    //START: Card Body as DIV:
    var patientCardDiv = document.createElement("DIV");
    patientCardDiv.classList.add("card-body");
    
    //START: Card Content as A:
    var patientCardContent = document.createElement("A");
    patientCardContent.classList.add("card-content");
    patientCardContent.setAttribute("href", "/client/templates/patientProfile.html");

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

    //Card Buttons as UL, LI, DIV, SPAN:
    var ul = document.createElement("UL");
    var li1 = document.createElement("LI");
    var li2 = document.createElement("LI");

    //Delete:
    var btn1 = document.createElement("DIV");
    btn1.classList.add("btn");
    btn1.setAttribute("onclick", "delFunc(".concat(patient.patient_id).concat(")"));

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
    btn2.setAttribute("onclick", "return toggleForm()");

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

function createForm(){
    //START: Form wrapper as DIV:
    var formWrapper = document.createElement("DIV");
    formWrapper.classList.add("popup-form");

    //START: Form as FORM:
    var form = document.createElement("FORM");
    form.setAttribute("action", "#");

    //First Name:
    var labelFName = document.createElement("LABEL");
    labelFName.setAttribute("for", "fname");
    var break1 = document.createElement("BR");
    
    var fieldFName = document.createElement("INPUT");
    fieldFName.setAttribute("type", "text");
    fieldFName.setAttribute("name", "fname");
    fieldFName.setAttribute("id", "fname");
    var break2 = document.createElement("BR");
    
    form.append(labelFName);
    form.append(break1);
    form.append(fieldFName);
    form.append(break2);

    //Last Name:
    var labelLName = document.createElement("LABEL");
    labelLName.setAttribute("for", "lname");
    var break3 = document.createElement("BR");
    
    var fieldLName = document.createElement("INPUT");
    fieldLName.setAttribute("type", "text");
    fieldLName.setAttribute("name", "lname");
    fieldLName.setAttribute("id", "lname");
    var break4 = document.createElement("BR");
     
    form.append(labelLName);
    form.append(break3);
    form.append(fieldLName);
    form.append(break4);

    //Age:
    var labelAge = document.createElement("LABEL");
    labelAge.setAttribute("for", "age");
    var break5 = document.createElement("BR");
      
    var fieldAge = document.createElement("INPUT");
    fieldAge.setAttribute("type", "number");
    fieldAge.setAttribute("name", "age");
    fieldAge.setAttribute("id", "age");
    var break6 = document.createElement("BR");

    form.append(labelAge);
    form.append(break5);
    form.append(fieldAge);
    form.append(break6);

    //Submit:
    var submit = document.createElement("INPUT");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "submit");
    submit.setAttribute("onclick", "toggleForm()");

    //STOP: Form as FORM:
    form.append(submit);

    //STOP: Form wrapper as DIV:
    formWrapper.append(form);

    return formWrapper;
}

function toggleForm(event){
    var blur = document.getElementById("blur");
    blur.classList.toggle("active");
    
    var popup = document.getElementById("popup");
    popup.classList.toggle("active");
}

function getPatients(){
    return fetch("http://192.168.100.71:5000/api/patient")
    .then((res) => res.json())
    .then((json) => json);
}

function getRecord(patient_id){
    return fetch("http://192.168.100.71:5000/api/record/".concat(patient_id))
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

function delFunc(patient_id){
    var funcPath = "/api/patient/".concat(patient_id);

    return fetch(funcPath, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
        }
    });
}

function patchFunc(patient_id){
    var funcPath = "/api/patient/".concat(patient_id);

    return fetch(funcPath, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        }
    });
}
