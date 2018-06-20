var navDiv;
var floodData, floodLayer;
var mapDiv, map;
var timeSlider, timeButton;;
var preview, pSlider;
const startTime = moment('2017-09-01T00:00:00Z');
var timestamp = startTime;

function preload() {
  const url = dataURL();
  floodData = loadJSON(url);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  createNav();
  createMap();
  drawRoads(floodData);
}

function draw() {
  timestamp = moment(startTime).add(timeSlider.value(), 'hours');
  preview.html(`${timestamp.format('YYYY-MM-DD hh:mm')}`);
  if (pSlider !== timeSlider.value() ) {
    updateMap();
  }
}

function createNav() {
  navDiv = createDiv();
  navDiv.id('navbar');
  navDiv.style("position", "absolute");
  navDiv.style("height", "50px");
  navDiv.style("width", "100%");
  navDiv.style("background-color", "white");
  navDiv.style("box-shadow", "0px 0px 10px 0px rgba(0, 0, 0, .5)");

  timeSlider = createSlider(0, 167, 0, 1);
  timeSlider.style('color', '#c710b5');
  timeSlider.style('width', '200px');
  timeSlider.position((windowWidth/2 - timeSlider.width - 15), 15);
  pSlider = timeSlider.value();

  preview = createElement('p', startTime.format('YYYY-MM-DD hh:mm'));
  preview.id('preview');
  preview.style('font-family', "'Roboto', sans-serif");
  preview.position(windowWidth/2 + 15, 1);
};

function createMap() {
  mapDiv = createDiv();
  mapDiv.id('map');
  mapDiv.style("position", "absolute");
  mapDiv.style("top", "50px");
  mapDiv.style("bottom", "0px");
  mapDiv.style("width", "100%");
  map = L.map('map').setView([29.75, -95.35], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 10,
    attribution: null,
    "noWrap": false,
    subdomains: "abc"
  }).addTo(map);
  floodLayer  = L.layerGroup();
};

function drawRoads(floodData) {
  floodLayer.clearLayers();
  floodLayer.remove();
  for (let i = 0; i < floodData.features.length; i++) {
    L.geoJSON(floodData.features[i], {
      style() {
        return {
          weight: 2,
          color: "#c710b5",
          opacity: 1,
          fillColor: "#c710b5",
          fillOpacity: 0.5
        }
      }
    }).addTo(floodLayer);
  }
  floodLayer.addTo(map);
}

function updateMap() {
  const url = dataURL();
  loadJSON(url, drawRoads);
  pSlider = timeSlider.value();
}

function dataURL() {
  let date = timestamp.utc().format('YYYY-MM-DD');
  return `data/${date}/${timestamp.utc().format()}/houston.geojson`
}
