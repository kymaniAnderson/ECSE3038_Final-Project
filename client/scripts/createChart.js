var connectionURL = "http://192.168.100.68:5000"
var id = ""
var xAxis = [];
var yAxis = [];

window.onload = function() {
    id = sessionStorage.getItem("patient_id");
    //sessionStorage.removeItem("patient_id");

    drawChart();
};

function getPatient(patient_id){
    return fetch(connectionURL.concat("/api/patient/".concat(patient_id)))
    .then((res) => res.json())
    .then((json) => json);
}

function getRecords(){
    return fetch(connectionURL.concat("/api/record"))
    .then((res) => res.json())
    .then((json) => json);
}

async function getPosTemp(){
    let records = await getRecords();

    records.forEach((record) => {
        if (record.patient_id === id){
            document.getElementById("position").innerHTML = record.position;
            document.getElementById("temperature").innerHTML = record.temperature;
            yAxis.push(record.temperature);
            xAxis.push(record.last_updated);
        }
    });

    console.log(yAxis);
    console.log(xAxis);
}

async function drawChart(){
    let patient = await getPatient(id);
    console.log(patient);

    document.getElementById("lname").innerHTML = patient.lname;
    document.getElementById("fname").innerHTML = patient.fname;

    getPosTemp();
    createPatientChart();
}

function createPatientChart(){
    var chart = document.getElementById('chart').getContext('2d');
    new Chart(chart, {
        type: 'line',
        data: {
            labels: xAxis,
            datasets: [{
                label: 'Patient Temperature Over The Last 30mins',
                data: yAxis,
                fill: true,
                borderColor: '#6048CC',
                backgroundColor: '#6048CC1A',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return value + '°';
                        }
                    }
                }
            }
        }
    });
}

var eventSource = new EventSource(connectionURL.concat("/listen"))
eventSource.addEventListener("message", function(e){
    console.log(e.data)
}, false)

var eventSource = new EventSource(connectionURL.concat("/listen"))
eventSource.addEventListener("online", function(e){
    data = JSON.parse(e.data);
    var incomingPos = data.position;
    var incomingTemp = data.temperature;
    var incomingID = data.patient_id;

    if (incomingID === id){
        document.getElementById("position").innerHTML = incomingPos;
        document.getElementById("temperature").innerHTML = incomingTemp;
    }
    else{
        // pass
    }
}, true)