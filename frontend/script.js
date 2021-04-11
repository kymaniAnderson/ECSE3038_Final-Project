//Create Cards
function createTankCard(tank){
    //Card Container:
    var tankCardDiv = document.createElement("DIV");
    tankCardDiv.classList.add("tank-cards");
    
    var tankContentCardDiv = document.createElement("DIV");
    tankContentCardDiv.classList.add("card-content");

    //tank_id:
    var tankLabelID = document.createElement("H4");
    tankLabelID.classList.add("tankID-label");
    tankLabelID.innerHTML = "Latitude: ";

    var tankValueID = document.createElement("SPAN");
    tankValueID.classList.add("tankID-value");
    tankValueID.innerHTML = tank.id;

    tankLabelID.append(tankValueID);
    
    //temp:
    var tankLabelTemp = document.createElement("H4");
    tankLabelTemp.classList.add("temp-label");
    tankLabelTemp.innerHTML = "Temperature: ";

    var tankValueTemp = document.createElement("SPAN");
    tankValueTemp.classList.add("temp-value");
    tankValueTemp.innerHTML = tank.temp;

    tankLabelTemp.append(tankValueTemp);
    
    //accel:
    var tankLabelAccel = document.createElement("H4");
    tankLabelAccel.classList.add("accel-label");
    tankLabelAccel.innerHTML = "Acceleration: ";

    var tankValueAccel = document.createElement("SPAN");
    tankValueAccel.classList.add("accel-value");
    tankValueAccel.innerHTML = tank.accel;

    tankLabelAccel.append(tankValueAccel);
    
    tankContentCardDiv.append(tankLabelID);
    tankContentCardDiv.append(tankLabelTemp);
    tankContentCardDiv.append(tankLabelAccel);

    tankCardDiv.append(tankContentCardDiv);

    return tankCardDiv;
}

function getTanks(){
    return fetch("http://127.0.0.1:5000/data")
    .then((res) => res.json())
    .then((json) => json);
}

async function drawCard(){
    let tanks = await getTanks();
    console.log(tanks);
    tanks.forEach((tank) => {
        var container = document.querySelector(".container");
        container.append(createTankCard(tank));
    });
}

var container = document.querySelector(".container");

window.onload = function () {
  drawCard();
};