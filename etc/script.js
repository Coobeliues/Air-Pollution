// const iaquElement = document.getElementById('iaqi');
// const pm25Element = document.getElementById('pm25');
// const pm10Element = document.getElementById('pm10');
// const no2Element = document.getElementById('no2');
// const tempElement = document.getElementById('t');
// const windElement = document.getElementById('w');

// const pm25ChartCanvas = document.getElementById('pm25Chart');
// const pm10ChartCanvas = document.getElementById('pm10Chart');
// const pm25ChartCtx = pm25ChartCanvas.getContext('2d');
// const pm10ChartCtx = pm10ChartCanvas.getContext('2d');
// let pm25Chart, pm10Chart;

// async function fetchAirQualityData() {
//     try {
//         const response = await fetch('http://localhost:8000/api/air_quality');
//         const data = await response.json();
//         updateUI(data);
//         updateCharts(data);
//     } catch (error) {
//         console.error('Error fetching air quality data:', error);
//     }
// }



// function updateUI(data) {
//     if ('data' in data && 'iaqi' in data.data && 'pm25' in data.data.iaqi) {
//         pm25Element.textContent = data.data.iaqi.pm25.v.toFixed(2);
//     } else {
//         pm25Element.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data ) {
//         iaquElement.textContent = data.data.aqi;
//     } else {
//         iaquElement.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 'pm10' in data.data.iaqi) {
//         pm10Element.textContent = data.data.iaqi.pm10.v.toFixed(2);
//     } else {
//         pm10Element.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 'no2' in data.data.iaqi) {
//         no2Element.textContent = data.data.iaqi.no2.v.toFixed(2);
//     } else {
//         no2Element.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 't' in data.data.iaqi) {
//         tempElement.textContent = data.data.iaqi.t.v.toFixed(2);
//     } else {
//         tempElement.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 'w' in data.data.iaqi) {
//         windElement.textContent = data.data.iaqi.w.v.toFixed(2);
//     } else {
//         windElement.textContent = "N/A";
//     }
// }


// function updateCharts(data) {
//     if ('data' in data && 'forecast' in data.data && 'daily' in data.data.forecast) {
//         const forecast = data.data.forecast.daily;

//         const pm25Data = {
//             labels: forecast.pm25.map(entry => new Date(entry.day)),
//             datasets: [{
//                 label: 'PM2.5 (µg/m³)',
//                 data: forecast.pm25.map(entry => ({
//                     x: new Date(entry.day),
//                     y: entry.avg,
//                     min: entry.min,
//                     max: entry.max
//                 })),
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 borderWidth: 1
//             }]
//         };

//         const pm10Data = {
//             labels: forecast.pm10.map(entry => new Date(entry.day)),
//             datasets: [{
//                 label: 'PM10 (µg/m³)',
//                 data: forecast.pm10.map(entry => ({
//                     x: new Date(entry.day),
//                     y: entry.avg,
//                     min: entry.min,
//                     max: entry.max
//                 })),
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1
//             }]
//         };

//          // Destroy existing charts before creating new ones
//          if (pm25Chart) {
//             pm25Chart.destroy();
//         }
//         if (pm10Chart) {
//             pm10Chart.destroy();
//         }

//         pm25Chart = new Chart(pm25ChartCtx, {
//             type: 'line',
//             data: pm25Data,
//             options: {
//                 // ...
//             }
//         });

//         pm10Chart = new Chart(pm10ChartCtx, {
//             type: 'line',
//             data: pm10Data,
//             options: {
//                 // ...
//             }
//         });
//     } else {
//         console.log("Forecast data not found.");
//     }
// }


// // Fetch air quality data initially
// fetchAirQualityData();

// // Fetch air quality data every 5 seconds
// setInterval(fetchAirQualityData,  50000);




// script.js
// script.js

const iaqiElement = document.getElementById('iaqi');
const pm25Element = document.getElementById('pm25');
const pm10Element = document.getElementById('pm10');
const no2Element = document.getElementById('no2');
const tempElement = document.getElementById('t');
const windElement = document.getElementById('w');


const pm25ChartCanvas = document.getElementById('pm25Chart');
const pm10ChartCanvas = document.getElementById('pm10Chart');
const pm25ChartCtx = pm25ChartCanvas.getContext('2d');
const pm10ChartCtx = pm10ChartCanvas.getContext('2d');
let pm25Chart, pm10Chart;

// Map-related variables and functions
let map;
let allMarkers = {};

function createMap() {
    var OpenStreetMap_Mapnik = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
    );

    map = L.map('leaflet-map', {
        attributionControl: false,
        gestureHandling: true,
        zoomSnap: 0.1,
    }).setView([0, 0], 12).addLayer(OpenStreetMap_Mapnik);

    setTimeout(function () {
        map.on('moveend', function () {
            let bounds = map.getBounds();
            bounds =
                bounds.getNorth() +
                ',' +
                bounds.getWest() +
                ',' +
                bounds.getSouth() +
                ',' +
                bounds.getEast();
            document.getElementById('leaflet-map-bounds').innerHTML =
                'bounds: ' + bounds.split(',').join(', ');

            populateMarkers(map, bounds, true);
        });
    }, 1000);

    return map;
}

async function populateMarkers(map, bounds, isRefresh) {
    try {
        const response = await fetch(
            'https://api.waqi.info/v2/map/bounds/?latlng=' +
            bounds +
            '&token=' +
            token()
        );
        const stations = await response.json();
        if (stations.status !== 'ok') throw stations.data;

        stations.data.forEach(station => {
            if (allMarkers[station.uid]) {
                map.removeLayer(allMarkers[station.uid]);
            }

            let iw = 83, ih = 107;
            let icon = L.icon({
                iconUrl: 'https://waqi.info/mapicon/' + station.aqi + '.30.png',
                iconSize: [iw / 2, ih / 2],
                iconAnchor: [iw / 4, ih / 2 - 5],
            });

            let marker = L.marker([station.lat, station.lon], {
                zIndexOffset: station.aqi,
                title: station.station.name,
                icon: icon,
            }).addTo(map);

            marker.on('click', function () {
                let popup = L.popup()
                    .setLatLng([station.lat, station.lon])
                    .setContent(station.station.name)
                    .openOn(map);

                getMarkerPopup(station.uid).then(info => {
                    popup.setContent(info);
                });
            });

            allMarkers[station.uid] = marker;
        });

        document.getElementById('leaflet-map-error').style.display = 'none';
        return stations.data.map(
            station_1 => new L.LatLng(station_1.lat, station_1.lon)
        );
    } catch (error) {
        var o = document.getElementById('leaflet-map-error');
        o.innerHTML = 'Sorry....' + error;
        o.style.display = '';
    }
}

function populateAndFitMarkers(map, bounds) {
    removeMarkers(map);
    if (bounds.split(',').length === 2) {
        let [lat, lng] = bounds.split(',');
        lat = parseFloat(lat);
        lng = parseFloat(lng);
        bounds = `${lat - 0.5},${lng - 0.5},${lat + 0.5},${lng + 0.5}`;
    }
    populateMarkers(map, bounds).then(markerBounds => {
        let [lat1, lng1, lat2, lng2] = bounds.split(',');
        let mapBounds = L.latLngBounds(
            L.latLng(lat2, lng2),
            L.latLng(lat1, lng1)
        );
        map.fitBounds(mapBounds, { maxZoom: 12, paddingTopLeft: [0, 40] });
    });
}

function removeMarkers(map) {
    Object.values(allMarkers).forEach(marker => map.removeLayer(marker));
    allMarkers = {};
}

async function getMarkerPopup(markerUID) {
    const marker = await getMarkerAQI(markerUID);
    let info = marker.city.name +
        ': AQI ' +
        marker.aqi +
        ' updated on ' +
        new Date(marker.time.v * 1000).toLocaleTimeString() + '';
    if (marker.city.location) {
        info += '<b>Location</b>: ';
        info += '<small>' + marker.city.location + '</small>';
    }
    let pollutants = ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co'];
    info += '<b>Pollutants</b>: ';
    for (let specie in marker.iaqi) {
        if (pollutants.indexOf(specie) >= 0) {
            info += '<u>' + specie + '</u>:' + marker.iaqi[specie].v + ' ';
        }
    }
    info += '';
    info += '<b>Weather</b>: ';
    for (let specie_1 in marker.iaqi) {
        if (pollutants.indexOf(specie_1) < 0) {
            info += '<u>' + specie_1 + '</u>:' + marker.iaqi[specie_1].v + ' ';
        }
    }
    info += '';
    info += '<b>Attributions</b>: <small>';
    info += marker.attributions
        .map(attribution => {
            return (
                '<a target=_ href="' +
                attribution.url +
                '">' +
                attribution.name +
                '</a>'
            );
        })
        .join(' - ');
    return info;
}

async function getMarkerAQI(markerUID) {
    const response = await fetch(
        'https://api.waqi.info/feed/@' + markerUID + '/?token=' + token()
    );
    const data = await response.json();
    if (data.status !== 'ok') throw data.reason;
    return data.data;
}

function init() {
    map = createMap();

    const locations = {
        Beijing: '39.379436,116.091230,40.235643,116.784382',
        Bucharest:
            '44.50858895332098,25.936583232631918,44.389144165939854,26.300222840009447',
        London: '51.69945358064312,-0.5996591366844406,51.314690280921894,0.3879568209963314',
        Bangalore:
            '13.106898860432123,77.38497433246386,12.825861486200223,77.84571346820603',
        Gdansk: '54.372158,18.638306',
        Paris: '48.864716,2.349014',
        'Los Angeles': '34.052235,-118.243683',
        Seoul: '37.532600,127.024612',
        Jakarta: '-6.200000,106.816666',
    };

    let oldButton;
    function addLocationButton(location, bounds) {
        let button = document.createElement('div');
        button.classList.add('ui', 'button', 'tiny');
        document.getElementById('leaflet-locations').appendChild(button);
        button.innerHTML = location;
        let activate = () => {
            populateAndFitMarkers(map, bounds);
            if (oldButton) oldButton.classList.remove('primary');
            button.classList.add('primary');
            oldButton = button;
        };
        button.onclick = activate;
        return activate;
    }

    Object.keys(locations).forEach(location => {
        let bounds = locations[location];
        let activate = addLocationButton(location, bounds);
        if (location === 'Beijing') activate();
    });

    fetch('https://api.waqi.info/v2/feed/here/?token=' + token())
        .then(response => response.json())
        .then(data => {
            addLocationButton(data.data.city.name, data.data.city.geo.join(','));
        });
}





// Function to update the UI with air quality data
function updateUI(data) {
    if ('data' in data && 'iaqi' in data.data && 'pm25' in data.data.iaqi) {
        pm25Element.textContent = data.data.iaqi.pm25.v.toFixed(2);
    } else {
        pm25Element.textContent = 'N/A';
    }

    if ('data' in data && 'iaqi' in data.data) {
        iaqiElement.textContent = data.data.aqi;
    } else {
        iaqiElement.textContent = 'N/A';
    }

    if ('data' in data && 'iaqi' in data.data && 'pm10' in data.data.iaqi) {
        pm10Element.textContent = data.data.iaqi.pm10.v.toFixed(2);
    } else {
        pm10Element.textContent = 'N/A';
    }

    if ('data' in data && 'iaqi' in data.data && 'no2' in data.data.iaqi) {
        no2Element.textContent = data.data.iaqi.no2.v.toFixed(2);
    } else {
        no2Element.textContent = 'N/A';
    }

    if ('data' in data && 'iaqi' in data.data && 't' in data.data.iaqi) {
        tempElement.textContent = data.data.iaqi.t.v.toFixed(2);
    } else {
        tempElement.textContent = 'N/A';
    }

    if ('data' in data && 'iaqi' in data.data && 'w' in data.data.iaqi) {
        windElement.textContent = data.data.iaqi.w.v.toFixed(2);
    } else {
        windElement.textContent = 'N/A';
    }
}

// Function to update the charts with air quality data
function updateCharts(data) {
    if ('data' in data && 'forecast' in data.data && 'daily' in data.data.forecast) {
        const forecast = data.data.forecast.daily;

        const pm25Data = {
            labels: forecast.pm25.map(entry => new Date(entry.day)),
            datasets: [{
                label: 'PM2.5 (µg/m³)',
                data: forecast.pm25.map(entry => ({
                    x: new Date(entry.day),
                    y: entry.avg,
                    min: entry.min,
                    max: entry.max
                })),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        };

        const pm10Data = {
            labels: forecast.pm10.map(entry => new Date(entry.day)),
            datasets: [{
                label: 'PM10 (µg/m³)',
                data: forecast.pm10.map(entry => ({
                    x: new Date(entry.day),
                    y: entry.avg,
                    min: entry.min,
                    max: entry.max
                })),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        // Destroy existing charts before creating new ones
        if (pm25Chart) {
            pm25Chart.destroy();
        }
        if (pm10Chart) {
            pm10Chart.destroy();
        }

        pm25Chart = new Chart(pm25ChartCtx, {
            type: 'line',
            data: pm25Data,
            options: {
                // ...
            }
        });

        pm10Chart = new Chart(pm10ChartCtx, {
            type: 'line',
            data: pm10Data,
            options: {
                // ...
            }
        });
    } else {
        console.log('Forecast data not found.');
    }
}



// Fetch air quality data initially
fetchAirQualityData();
function token() {
    return "6022f160d335edf3cabb5b495b6c860eac0cdbc1"; // Replace with your actual WAQI API token
}
init();
// Fetch air quality data every 50 seconds
setInterval(fetchAirQualityData,  50000);









// const iaquElement = document.getElementById('iaqi');
// const pm25Element = document.getElementById('pm25');
// const pm10Element = document.getElementById('pm10');
// const no2Element = document.getElementById('no2');
// const tempElement = document.getElementById('t');
// const windElement = document.getElementById('w');

// const pm25ChartCanvas = document.getElementById('pm25Chart');
// const pm10ChartCanvas = document.getElementById('pm10Chart');
// const pm25ChartCtx = pm25ChartCanvas.getContext('2d');
// const pm10ChartCtx = pm10ChartCanvas.getContext('2d');
// let pm25Chart, pm10Chart;

// let allMarkers = {};
// let map; // Declare map globally

// // Initialize Leaflet library
// L.Icon.Default.imagePath = 'https://unpkg.com/browse/leaflet@1.9.4/dist/images/';

// async function fetchAirQualityData() {
//     try {
//         const response = await fetch('http://localhost:8000/api/air_quality');
//         const data = await response.json();
//         updateUI(data);
//         updateCharts(data);
//         // Call your createMap function here to initialize the map
//         createMap();
//     } catch (error) {
//         console.error('Error fetching air quality data:', error);
//     }
// }

// function updateUI(data) {
//     if ('data' in data && 'iaqi' in data.data && 'pm25' in data.data.iaqi) {
//         pm25Element.textContent = data.data.iaqi.pm25.v.toFixed(2);
//     } else {
//         pm25Element.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data ) {
//         iaquElement.textContent = data.data.aqi;
//     } else {
//         iaquElement.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 'pm10' in data.data.iaqi) {
//         pm10Element.textContent = data.data.iaqi.pm10.v.toFixed(2);
//     } else {
//         pm10Element.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 'no2' in data.data.iaqi) {
//         no2Element.textContent = data.data.iaqi.no2.v.toFixed(2);
//     } else {
//         no2Element.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 't' in data.data.iaqi) {
//         tempElement.textContent = data.data.iaqi.t.v.toFixed(2);
//     } else {
//         tempElement.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 'w' in data.data.iaqi) {
//         windElement.textContent = data.data.iaqi.w.v.toFixed(2);
//     } else {
//         windElement.textContent = "N/A";
//     }
// }

// function updateCharts(data) {
//     if ('data' in data && 'forecast' in data.data && 'daily' in data.data.forecast) {
//         const forecast = data.data.forecast.daily;

//         const pm25Data = {
//             labels: forecast.pm25.map(entry => new Date(entry.day)),
//             datasets: [{
//                 label: 'PM2.5 (µg/m³)',
//                 data: forecast.pm25.map(entry => ({
//                     x: new Date(entry.day),
//                     y: entry.avg,
//                     min: entry.min,
//                     max: entry.max
//                 })),
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 borderWidth: 1
//             }]
//         };

//         const pm10Data = {
//             labels: forecast.pm10.map(entry => new Date(entry.day)),
//             datasets: [{
//                 label: 'PM10 (µg/m³)',
//                 data: forecast.pm10.map(entry => ({
//                     x: new Date(entry.day),
//                     y: entry.avg,
//                     min: entry.min,
//                     max: entry.max
//                 })),
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1
//             }]
//         };

//          // Destroy existing charts before creating new ones
//          if (pm25Chart) {
//             pm25Chart.destroy();
//         }
//         if (pm10Chart) {
//             pm10Chart.destroy();
//         }

//         pm25Chart = new Chart(pm25ChartCtx, {
//             type: 'line',
//             data: pm25Data,
//             options: {
//                 // ...
//             }
//         });

//         pm10Chart = new Chart(pm10ChartCtx, {
//             type: 'line',
//             data: pm10Data,
//             options: {
//                 // ...
//             }
//         });
//     } else {
//         console.log("Forecast data not found.");
//     }
// }



// function createMap() {
//     var OpenStreetMap_Mapnik = L.tileLayer(
//         "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//         {
//             maxZoom: 19,
//             attribution:
//                 '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//         }
//     );

//     map = L.map(document.getElementById("leaflet-map"), {
//         attributionControl: false,
//         gestureHandling: true,
//         zoomSnap: 0.1,
//     }).setView([0, 0], 12).addLayer(OpenStreetMap_Mapnik);

//     setTimeout(function () {
//         map.on("moveend", () => {
//             let bounds = map.getBounds();
//             bounds =
//                 bounds.getNorth() +
//                 "," +
//                 bounds.getWest() +
//                 "," +
//                 bounds.getSouth() +
//                 "," +
//                 bounds.getEast();
//             document.getElementById("leaflet-map-bounds").innerHTML =
//                 "bounds: " + bounds.split(",").join(", ");

//             populateMarkers(map, bounds, true);
//         });
//     }, 1000);

//     return map;
// }

// function populateMarkers(map, bounds, isRefresh) {
//     return fetch(
//         "https://api.waqi.info/v2/map/bounds/?latlng=" +
//             bounds +
//             "&token=" +
//             token() // Implement token() function to retrieve WAQI API token
//     )
//         .then((response) => response.json())
//         .then((stations) => {
//             if (stations.status != "ok") throw stations.data;

//             stations.data.forEach((station) => {
//                 if (allMarkers[station.uid]) map.removeLayer(allMarkers[station.uid]);

//                 let iw = 83,
//                     ih = 107;
//                 let icon = L.icon({
//                     iconUrl:
//                         "https://waqi.info/mapicon/" + station.aqi + ".30.png",
//                     iconSize: [iw / 2, ih / 2],
//                     iconAnchor: [iw / 4, ih / 2 - 5],
//                 });

//                 let marker = L.marker([station.lat, station.lon], {
//                     zIndexOffset: station.aqi,
//                     title: station.station.name,
//                     icon: icon,
//                 }).addTo(map);

//                 marker.on("click", () => {
//                     let popup = L.popup()
//                         .setLatLng([station.lat, station.lon])
//                         .setContent(station.station.name)
//                         .openOn(map);

//                     getMarkerPopup(station.uid).then((info) => {
//                         popup.setContent(info);
//                     });
//                 });

//                 allMarkers[station.uid] = marker;
//             });

//             document.getElementById("leaflet-map-error").style.display = "none";
//             return stations.data.map(
//                 (station) => new L.LatLng(station.lat, station.lon)
//             );
//         })
//         .catch((e) => {
//             var o = document.getElementById("leaflet-map-error");
//             o.innerHTML = "Sorry...." + e;
//             o.style.display = "";
//         });
// }

// // ... (other functions and code)





// // Fetch air quality data initially
// fetchAirQualityData();

// // Fetch air quality data every 5 seconds
// setInterval(fetchAirQualityData, 50000);

// // Implement token() function to retrieve WAQI API token
// function token() {
//     return "6022f160d335edf3cabb5b495b6c860eac0cdbc1"; // Replace with your actual WAQI API token
// }

// // ... (other functions and code)





// const iaquElement = document.getElementById('iaqi');
// const pm25Element = document.getElementById('pm25');
// const pm10Element = document.getElementById('pm10');
// const no2Element = document.getElementById('no2');
// const tempElement = document.getElementById('t');
// const windElement = document.getElementById('w');

// const pm25ChartCanvas = document.getElementById('pm25Chart');
// const pm10ChartCanvas = document.getElementById('pm10Chart');
// const pm25ChartCtx = pm25ChartCanvas.getContext('2d');
// const pm10ChartCtx = pm10ChartCanvas.getContext('2d');
// let pm25Chart, pm10Chart;

// let allMarkers = {};
// let map; // Declare map globally

// // Initialize Leaflet library
// L.Icon.Default.imagePath = 'https://unpkg.com/browse/leaflet@1.9.4/dist/images/';

// async function fetchAirQualityData() {
//     try {
//         const response = await fetch('http://localhost:8000/api/air_quality');
//         const data = await response.json();
//         updateUI(data);
//         updateCharts(data);
//         // Call your createMap function here to initialize the map
//         createMap();
//     } catch (error) {
//         console.error('Error fetching air quality data:', error);
//     }
// }

// function updateUI(data) {
//     if ('data' in data && 'iaqi' in data.data && 'pm25' in data.data.iaqi) {
//         pm25Element.textContent = data.data.iaqi.pm25.v.toFixed(2);
//     } else {
//         pm25Element.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data ) {
//         iaquElement.textContent = data.data.aqi;
//     } else {
//         iaquElement.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 'pm10' in data.data.iaqi) {
//         pm10Element.textContent = data.data.iaqi.pm10.v.toFixed(2);
//     } else {
//         pm10Element.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 'no2' in data.data.iaqi) {
//         no2Element.textContent = data.data.iaqi.no2.v.toFixed(2);
//     } else {
//         no2Element.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 't' in data.data.iaqi) {
//         tempElement.textContent = data.data.iaqi.t.v.toFixed(2);
//     } else {
//         tempElement.textContent = "N/A";
//     }

//     if ('data' in data && 'iaqi' in data.data && 'w' in data.data.iaqi) {
//         windElement.textContent = data.data.iaqi.w.v.toFixed(2);
//     } else {
//         windElement.textContent = "N/A";
//     }
// }

// function updateCharts(data) {
//     if ('data' in data && 'forecast' in data.data && 'daily' in data.data.forecast) {
//         const forecast = data.data.forecast.daily;

//         const pm25Data = {
//             labels: forecast.pm25.map(entry => new Date(entry.day)),
//             datasets: [{
//                 label: 'PM2.5 (µg/m³)',
//                 data: forecast.pm25.map(entry => ({
//                     x: new Date(entry.day),
//                     y: entry.avg,
//                     min: entry.min,
//                     max: entry.max
//                 })),
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 borderWidth: 1
//             }]
//         };

//         const pm10Data = {
//             labels: forecast.pm10.map(entry => new Date(entry.day)),
//             datasets: [{
//                 label: 'PM10 (µg/m³)',
//                 data: forecast.pm10.map(entry => ({
//                     x: new Date(entry.day),
//                     y: entry.avg,
//                     min: entry.min,
//                     max: entry.max
//                 })),
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1
//             }]
//         };

//          // Destroy existing charts before creating new ones
//          if (pm25Chart) {
//             pm25Chart.destroy();
//         }
//         if (pm10Chart) {
//             pm10Chart.destroy();
//         }

//         pm25Chart = new Chart(pm25ChartCtx, {
//             type: 'line',
//             data: pm25Data,
//             options: {
//                 // ...
//             }
//         });

//         pm10Chart = new Chart(pm10ChartCtx, {
//             type: 'line',
//             data: pm10Data,
//             options: {
//                 // ...
//             }
//         });
//     } else {
//         console.log("Forecast data not found.");
//     }
// }

// function createMap() {
//     var OpenStreetMap_Mapnik = L.tileLayer(
//         "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//         {
//             maxZoom: 19,
//             attribution:
//                 '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//         }
//     );

//     map = L.map(document.getElementById("leaflet-map"), {
//         attributionControl: false,
//         gestureHandling: true,
//         zoomSnap: 0.1,
//     }).setView([0, 0], 12).addLayer(OpenStreetMap_Mapnik);

//     setTimeout(function () {
//         map.on("moveend", () => {
//             let bounds = map.getBounds();
//             bounds =
//                 bounds.getNorth() +
//                 "," +
//                 bounds.getWest() +
//                 "," +
//                 bounds.getSouth() +
//                 "," +
//                 bounds.getEast();
//             document.getElementById("leaflet-map-bounds").innerHTML =
//                 "bounds: " + bounds.split(",").join(", ");

//             populateMarkers(map, bounds, true);
//         });
//     }, 1000);

//     return map;
// }

// function populateMarkers(map, bounds, isRefresh) {
//     return fetch(
//         "https://api.waqi.info/v2/map/bounds/?latlng=" +
//             bounds +
//             "&token=" +
//             token()
//     )
//         .then((response) => response.json())
//         .then((stations) => {
//             if (stations.status != "ok") throw stations.data;

//             stations.data.forEach((station) => {
//                 if (allMarkers[station.uid])
//                     map.removeLayer(allMarkers[station.uid]);

//                 let iw = 83,
//                     ih = 107;
//                 let icon = L.icon({
//                     iconUrl:
//                         "https://waqi.info/mapicon/" + station.aqi + ".30.png",
//                     iconSize: [iw / 2, ih / 2],
//                     iconAnchor: [iw / 4, ih / 2 - 5],
//                 });

//                 let marker = L.marker([station.lat, station.lon], {
//                     zIndexOffset: station.aqi,
//                     title: station.station.name,
//                     icon: icon,
//                 }).addTo(map);

//                 marker.on("click", () => {
//                     let popup = L.popup()
//                         .setLatLng([station.lat, station.lon])
//                         .setContent(station.station.name)
//                         .openOn(map);

//                     getMarkerPopup(station.uid).then((info) => {
//                         popup.setContent(info);
//                     });
//                 });

//                 allMarkers[station.uid] = marker;
//             });

//             document.getElementById("leaflet-map-error").style.display = "none";
//             return stations.data.map(
//                 (station) => new L.LatLng(station.lat, station.lon)
//             );
//         })
//         .catch((e) => {
//             var o = document.getElementById("leaflet-map-error");
//             o.innerHTML = "Sorry...." + e;
//             o.style.display = "";
//         });
// }

// function populateAndFitMarkers(map, bounds) {
//     removeMarkers(map);
//     if (bounds.split(",").length == 2) {
//         let [lat, lng] = bounds.split(",");
//         lat = parseFloat(lat);
//         lng = parseFloat(lng);
//         bounds = `${lat - 0.5},${lng - 0.5},${lat + 0.5},${lng + 0.5}`;
//     }
//     populateMarkers(map, bounds).then((markerBounds) => {
//         let [lat1, lng1, lat2, lng2] = bounds.split(",");
//         let mapBounds = L.latLngBounds(
//             L.latLng(lat2, lng2),
//             L.latLng(lat1, lng1)
//         );
//         map.fitBounds(mapBounds, { maxZoom: 12, paddingTopLeft: [0, 40] });
//     });
// }

// function removeMarkers(map) {
//     Object.values(allMarkers).forEach((marker) => map.removeLayer(marker));
//     allMarkers = {};
// }

// function getMarkerPopup(markerUID) {
//     return getMarkerAQI(markerUID).then((marker) => {
//         let info =
//             marker.city.name +
//             ": AQI " +
//             marker.aqi +
//             " updated on " +
//             new Date(marker.time.v * 1000).toLocaleTimeString() +
//             "";

//         if (marker.city.location) {
//             info += "<b>Location</b>: ";
//             info += "<small>" + marker.city.location + "</small>";
//         }

//         let pollutants = ["pm25", "pm10", "o3", "no2", "so2", "co"];

//         info += "<b>Pollutants</b>: ";
//         for (let specie in marker.iaqi) {
//             if (pollutants.includes(specie)) {
//                 info += "<u>" + specie + "</u>: " + marker.iaqi[specie].v + " ";
//             }
//         }
//         info += "";

//         info += "<b>Weather</b>: ";
//         for (let specie in marker.iaqi) {
//             if (!pollutants.includes(specie)) {
//                 info += "<u>" + specie + "</u>: " + marker.iaqi[specie].v + " ";
//             }
//         }
//         info += "";

//         info += "<b>Attributions</b>: <small>";
//         info += marker.attributions
//             .map(attribution => {
//                 return `<a target="_" href="${attribution.url}">${attribution.name}</a>`;
//             })
//             .join(" - ");

//         return info;
//     });
// }

// function getMarkerAQI(markerUID) {
//     return fetch(
//         "https://api.waqi.info/feed/@" + almaty + "/?token=" + token()
//     )
//         .then(response => response.json())
//         .then(data => {
//             if (data.status !== "ok") {
//                 throw new Error(data.reason);
//             }
//             return data.data;
//         });
// }

// function init() {
//     var map = createMap();

//     const locations = {
//         Beijing: "39.379436,116.091230,40.235643,116.784382",
//         Bucharest: "44.50858895332098,25.936583232631918,44.389144165939854,26.300222840009447",
//         London: "51.69945358064312,-0.5996591366844406,51.314690280921894,0.3879568209963314",
//         Bangalore: "13.106898860432123,77.38497433246386,12.825861486200223,77.84571346820603",
//         Gdansk: "54.372158,18.638306",
//         Paris: "48.864716,2.349014",
//         Seoul: "37.532600,127.024612",
//         Jakarta: "-6.200000,106.816666",
//     };

//     let oldButton;

//     function addLocationButton(location, bounds) {
//         let button = document.createElement("div");
//         button.classList.add("ui", "button", "tiny");
//         document.getElementById("leaflet-locations").appendChild(button);
//         button.innerHTML = location;

//         function activate() {
//             populateAndFitMarkers(map, bounds);
//             if (oldButton) {
//                 oldButton.classList.remove("primary");
//             }
//             button.classList.add("primary");
//             oldButton = button;
//         }

//         button.onclick = activate;
//         return activate;
//     }

//     Object.keys(locations).forEach((location, idx) => {
//         let bounds = locations[location];
//         let activate = addLocationButton(location, bounds);
//         if (idx === 0) {
//             activate();
//         }
//     });

//     fetch("https://api.waqi.info/v2/feed/almaty/?token=" + token())
//         .then(response => response.json())
//         .then(data => {
//             addLocationButton(data.data.city.name, data.data.city.geo.join(","));
//         });
// }

// init();

// // Fetch air quality data initially
// fetchAirQualityData();

// // Fetch air quality data every 5 seconds
// setInterval(fetchAirQualityData, 5000);

// // Implement token() function to retrieve WAQI API token
// function token() {
//     return "6022f160d335edf3cabb5b495b6c860eac0cdbc1"; // Replace with your actual WAQI API token
// }