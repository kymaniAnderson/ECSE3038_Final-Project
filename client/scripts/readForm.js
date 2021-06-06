// VARIABLE DECLARATIONS:
var connectionURL = "http://192.168.100.77:5000"

document.getElementById("patient-submit").addEventListener("click", function(event){
    event.preventDefault();
    sessionStorage.clear();  

    let patient_id = document.getElementById("patient_id").value;
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let age = document.getElementById("age").value;

    let jsonBody = {
        "patient_id": patient_id,
        "fname": fname,
        "lname": lname,
        "age": age
    };

    fetch(connectionURL.concat("/api/patient"), {
        method: "POST",
        body: JSON.stringify(jsonBody),
        headers:{
            "Content-type": "application/json",
        },
    })
    .then((res) => res.json)
    .then((json) => console.log(json));

    //redirect back to previous page:
    window.history.go(-1);
});