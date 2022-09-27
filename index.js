// https://api.wheretheiss.at/v1/satellites/25544

// Making a map and tiles
const mymap = L.map('issMap').setView([0, 0], 2);
const attribution = '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });

// Making a marker with a custom icon
const issIcon = L.icon({
    iconUrl: 'ISS.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16]//,
    // popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
});

const marker = L.marker([0, 0], {icon: issIcon}).addTo(mymap);

tiles.addTo(mymap);
const apiURL = 'https://api.wheretheiss.at/v1/satellites/25544';

// Page Elements
const page = {
    lat: document.getElementById('lat'),
    lon: document.getElementById('lon'),
    alt: document.getElementById('alt'),
    vel: document.getElementById('vel'),
    vis: document.getElementById('vis'),
    day: document.getElementById('day'),
    keepCentered: document.getElementById('keepCentered'),
    // pinInfo: document.getElementById('pin_info'),
    // hiddenInfo: document.getElementById('hidden_info'),
}



// Restore user settings from localStorage
keepCentered.checked = localStorage.getItem("keepCentered") == "true" ? true : false;
// if(localStorage.getItem("pinned") == null) {
//     console.log("No localStorage found, setting defaults");
//     localStorage.setItem("pinned", "false");
// }

console.log(`Settings restored:
keepCentered: ${localStorage.getItem("keepCentered")}
pinned: ${localStorage.getItem("pinned")}`);

let firstTime = true;
async function getISS() {
    const response = await fetch(apiURL);
    const data = await response.json();
    const { latitude, longitude, altitude, velocity, visibility, daynum } = data;

    marker.setLatLng([latitude, longitude]);
    if(firstTime || keepCentered.checked) {
        firstTime = false;
        mymap.setView([latitude, longitude]);
    }
    // mymap.setView([latitude, longitude]);
    

    lat.textContent = latitude.toFixed(2);
    lon.textContent = longitude.toFixed(2);
    alt.textContent = altitude.toFixed(2);
    vel.textContent = velocity.toFixed(2);
    vis.textContent = visibility;
    day.textContent = daynum.toFixed(1);

    console.log(`Lat: ${latitude}\nLon: ${longitude}\nAlt: ${altitude}`);
}

// Store keepCentered Option
function centered(override) {
    let state = override || keepCentered.checked;
    keepCentered.checked = state;
    localStorage.setItem("keepCentered", state);
    getISS();
}

// Pin info button
// pinTo(localStorage.getItem("pinned"));
// function pin() {
//     // Alternate
//     if(localStorage.getItem("pinned") == "true" || to == "false") {
//         pinTo("false");
//         localStorage.setItem("pinned", "false");
//     } else {
//         pinTo("true");
//         localStorage.setItem("pinned", "true");
//     }
    
// }

// function pinTo(to) {
//     if(to == "true") {
//         page.hiddenInfo.classList.remove("pinned");
//         page.pinInfo.classList.remove("pinned");
//     } else {
//         page.hiddenInfo.classList.add("pinned");
//         page.pinInfo.classList.add("pinned");
//     }
// }

document.getElementById("issMap").addEventListener("click", () => {
    keepCentered.checked = false;
});

getISS();
setInterval(getISS, 2000);
