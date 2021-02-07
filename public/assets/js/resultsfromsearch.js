let map;
let places;
let infoWindow;
let markers = [];
let autocomplete;
let placeTwo;
let searchImage;
const countryRestrict = { country: "us" };
let garbageOptions = [
  "garbage-img",
  "recycling-img",
  "compost-img",
  "organic-waste-img",
  "green-waste-img",
  "construction-waste-img",
];

let garbageOptionsInfo = [
  [
    "Municipal Solid Waste",
    "Municipal solid waste (MSW) refers to recyclables and compostable materials, as well as garbage from homes, businesses, institutions, and construction and demolition sites.",
    "https://i.ibb.co/FsggCN7/recycle-bin.png",
    "https://www.canada.ca/en/environment-climate-change/services/managing-reducing-waste/municipal-solid/shared-responsibility.html",
    "Source: Canadian Government",
  ],
  [
    "Recyclable Materials",
    "<div>Accepted Materials (Examples): Paper and Cardboard, Plastic (With the exception of no 6 plastic, Metal (cans, aluminum), Glass (Bottles, Containers)</div> <br/><div> Unacceptable Materials: Plastic no 6, Soiled Cardboard, Paint, Batteries, Mirrors, etc.</div>",
    "https://i.ibb.co/xHF6npG/recycle-sign.png",
    "http://ville.montreal.qc.ca/portal/page?_pageid=7237,75369725&_dad=portal&_schema=PORTAL",
    "Ville de Montréal",
  ],
  [
    "Food Waste",
    "<div>Accepted Materials (Examples): Meat, Fish Bones, Fruit Scraps, Tissue Paper</div> <br/> <div>Unacceptable Materials (Examples): Cigarettes, Burnt Candles, Diapers, Batteries </div>",
    "https://i.ibb.co/cLW2D9y/bone.png",
    "https://ville.montreal.qc.ca/portal/page?_pageid=7237,75371890&_dad=portal&_schema=PORTAL#matieres_acceptees",
    "Ville de Montréal",
  ],
  [
    "Organic Matter Waste",
    "<div>Accepted Materials (Examples): Raw Food, Soiled Paper and Cardboard, Green Waste</div> <br/> <div>Unacceptable Materials (Examples): Recyclable Materials, Rocks, Sand, Construction Materials, Oils, etc. </div>",
    "https://i.ibb.co/KWnD9Jq/plant-root.png",
    "https://montreal.ca/collectes/collecte-des-matieres-organiques?arrondissement=Pierrefonds-Roxboro",
    "Ville de Montréal",
  ],
  [
    "Green Waste",
    "<div> Accepted Materials (Examples): Gardening Waste, Tree, Tree Fruits, Grass Waste, Dead Leaves </div> <br/> <div>Must be stored in: Rigid Container with handles and without lids or Cardboard boxes or Special-Use Paper</div>",
    "https://i.ibb.co/CnhqR1q/autumn-leaf.png",
    "http://ville.montreal.qc.ca/portal/page?_pageid=7237,75371885&_dad=portal&_schema=PORTAL",
    "Ville de Montréal",
  ],
  [
    "Construction Waste",
    "<div> Accepted Materials (Examples): Furniture, Appliances, Construction Waste, Demolition Waste, Renovation Waste</div> <br/> <div>There is a limit of 5m^3 per address accepted (Depends on borough) and a maximum of 25 kg (55lb) per box</div>",
    "https://i.ibb.co/dJxwKbh/construction-excavator.png",
    "https://montreal.ca/collectes/collecte-des-encombrants-et-residus-de-construction?arrondissement=Villeray%E2%80%93Saint-Michel%E2%80%93Parc-Extension",
    "Ville de Montréal",
  ],
];
let currentGarbageType = garbageOptions[0];
document.getElementById(currentGarbageType).style.opacity = 1;
var dataObjPolygonArray = [];

for (let i = 0; i < garbageOptions.length; i++) {
  document
    .getElementById(garbageOptions[i])
    .addEventListener("click", function () {
      clearGarbage();
      document.getElementById(garbageOptions[i]).style.opacity = 1;
      document.getElementById("waste-info").style.display = "flex";
      document.getElementById("waste-info-img").src = garbageOptionsInfo[i][2];
      document.getElementById("waste-info-title").innerHTML =
        garbageOptionsInfo[i][0];
      document.getElementById("waste-info-description").innerHTML =
        garbageOptionsInfo[i][1];
      document.getElementById("waste-info-source").innerHTML =
        '<a href="' +
        garbageOptionsInfo[i][3] +
        '" target="_blank" >' +
        "Source: " +
        garbageOptionsInfo[i][4] +
        "</a>";
    });
}

function clearGarbage() {
  for (let i = 0; i < garbageOptions.length; i++) {
    document.getElementById(garbageOptions[i]).style.opacity = 0.2;
  }
}
// close X-button
document.getElementById("close-button").addEventListener("click", function () {
  document.getElementById("on-load-message").style.display = "none";
  map.setZoom(12);
  setTimeout(() => {
    document.getElementById("yellow-arrow").style.display = "flex";
  }, 2000);
  setTimeout(() => {
    document.getElementById("yellow-arrow").style.display = "none";
  }, 7000);
});

// Map is initially centered to North America coordinates
const countries = {
  address: {
    // Initial coordinates of the map
    center: { lat: 45.53, lng: -73.65 },
    zoom: 16,
  },
};

// Initialize google map API
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: countries["address"].zoom,
    center: countries["address"].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: true,
    streetViewControl: false,
    styles: mapstyling,
  });
}

let garbageImageArray = [
  '<div> <img id="garbage-img" style="width:30px" src="https://i.ibb.co/FsggCN7/recycle-bin.png" alt="cant see"/> Municipal Solid Waste </div> <br/>',
  '<div> <img id="garbage-img" style="width:30px" src="https://i.ibb.co/xHF6npG/recycle-sign.png" alt="cant see"/> Recyclable Materials </div> <br/>',
  '<div> <img id="garbage-img" style="width:30px" src="https://i.ibb.co/cLW2D9y/bone.png" alt="cant see"/> Food waste </div> <br/>',
  '<div> <img id="garbage-img" style="width:30px" src="https://i.ibb.co/KWnD9Jq/plant-root.png" alt="cant see"/> Organic Matter </div> <br/>',
  '<div> <img id="garbage-img" style="width:30px" src="https://i.ibb.co/CnhqR1q/autumn-leaf.png" alt="cant see"/> Green Waste </div> <br/>',
  '<div> <img id="garbage-img" style="width:30px" src="https://i.ibb.co/dJxwKbh/construction-excavator.png" alt="cant see"/> Construction Waste </div> <br/>',
];

let garbageColorArray = [
  ["#FF0000", "#00FF00"],
  ["#FF0000", "#00FF00"],
  ["#FF0000", "#00FF00"],
  ["#FF0000", "#00FF00"],
  ["#FF0000", "#00FF00"],
  ["#FF0000", "#00FF00"],
];

let stateOrdure = 1;

setTimeout(() => {
  createPolygons(
    orduremenagere,
    garbageColorArray[0][0],
    garbageColorArray[0][1],
    garbageImageArray[0]
  );
}, 250);

document
  .getElementById(garbageOptions[0])
  .addEventListener("click", function () {
    if (stateOrdure == 0) {
      for (let i = 0; i < dataObjPolygonArray.length; i++) {
        dataObjPolygonArray[i].setMap(null);
      }
      createPolygons(
        orduremenagere,
        garbageColorArray[0][0],
        garbageColorArray[0][1],
        garbageImageArray[0]
      );
      stateOrdure = 1;
      stateRecyclage = 0;
      stateCompost = 0;
      stateOrganicWaste = 0;
      stateConstructionWaste = 0;
    }
  });

let stateRecyclage = 0;
document
  .getElementById(garbageOptions[1])
  .addEventListener("click", function () {
    if (stateRecyclage == 0) {
      for (let i = 0; i < dataObjPolygonArray.length; i++) {
        dataObjPolygonArray[i].setMap(null);
      }
      createPolygons(
        recyclage,
        garbageColorArray[1][0],
        garbageColorArray[1][1],
        garbageImageArray[1]
      );
      stateOrdure = 0;
      stateRecyclage = 1;
      stateCompost = 0;
      stateOrganicWaste = 0;
      stateGreenWaste = 0;
      stateConstructionWaste = 0;
    }
  });

let stateCompost = 0;
document
  .getElementById(garbageOptions[2])
  .addEventListener("click", function () {
    if (stateCompost == 0) {
      for (let i = 0; i < dataObjPolygonArray.length; i++) {
        dataObjPolygonArray[i].setMap(null);
      }
      createPolygons(
        compost,
        garbageColorArray[2][0],
        garbageColorArray[2][1],
        garbageImageArray[2]
      );
      stateOrdure = 0;
      stateRecyclage = 0;
      stateCompost = 1;
      stateOrganicWaste = 0;
      stateGreenWaste = 0;
      stateConstructionWaste = 0;
    }
  });

let stateOrganicWaste = 0;
document
  .getElementById(garbageOptions[3])
  .addEventListener("click", function () {
    if (stateOrganicWaste == 0) {
      for (let i = 0; i < dataObjPolygonArray.length; i++) {
        dataObjPolygonArray[i].setMap(null);
      }
      createPolygons(
        organicwaste,
        garbageColorArray[3][0],
        garbageColorArray[3][1],
        garbageImageArray[3]
      );
      stateOrdure = 0;
      stateRecyclage = 0;
      stateCompost = 0;
      stateOrganicWaste = 1;
      stateGreenWaste = 0;
      stateConstructionWaste = 0;
    }
  });

let stateGreenWaste = 0;
document
  .getElementById(garbageOptions[4])
  .addEventListener("click", function () {
    if (stateGreenWaste == 0) {
      for (let i = 0; i < dataObjPolygonArray.length; i++) {
        dataObjPolygonArray[i].setMap(null);
      }
      createPolygons(
        greenwaste,
        garbageColorArray[4][0],
        garbageColorArray[4][1],
        garbageImageArray[4]
      );
      stateOrdure = 0;
      stateRecyclage = 0;
      stateCompost = 0;
      stateOrganicWaste = 0;
      stateGreenWaste = 1;
      stateConstructionWaste = 0;
    }
  });

let stateConstructionWaste = 0;
document
  .getElementById(garbageOptions[5])
  .addEventListener("click", function () {
    if (stateConstructionWaste == 0) {
      for (let i = 0; i < dataObjPolygonArray.length; i++) {
        dataObjPolygonArray[i].setMap(null);
      }
      createPolygons(
        constructionwaste,
        garbageColorArray[5][0],
        garbageColorArray[5][1],
        garbageImageArray[5]
      );
      stateOrdure = 0;
      stateRecyclage = 0;
      stateCompost = 0;
      stateOrganicWaste = 0;
      stateGreenWaste = 0;
      stateConstructionWaste = 1;
    }
  });

function play() {
  var audio = document.getElementById("audio");
  audio.play();
}

function convertToArrayOfLatLng(myArray) {
  let newArray = [];
  for (j = 0; j < myArray.length; j++) {
    let latVal = myArray[j][1];
    let lngVal = myArray[j][0];
    newArray.push({ lat: latVal, lng: lngVal });
  }
  return newArray;
}

function createPolygons(dataObj, color1, color2, garbageImage) {
  var arrayLatLngObjs = [];
  for (i = 0; i < dataObj.features.length; i++) {
    let type = dataObj.features[i].geometry.type;
    if (type == "MultiPolygon") {
      for (j = 0; j < dataObj.features[i].geometry.coordinates[0].length; j++) {
        arrayLatLngObjs.push([
          convertToArrayOfLatLng(
            dataObj.features[i].geometry.coordinates[0][j]
          ),
          dataObj.features[i].properties.SECTEUR,
          dataObj.features[i].properties.MESSAGE_EN,
        ]);
      }
    }
    if (type == "Polygon") {
      arrayLatLngObjs.push([
        convertToArrayOfLatLng(dataObj.features[i].geometry.coordinates[0]),
        dataObj.features[i].properties.SECTEUR,
        dataObj.features[i].properties.MESSAGE_EN,
      ]);
    }
  }

  for (i = 0; i < arrayLatLngObjs.length; i++) {
    let coordinates = arrayLatLngObjs[i][0];
    dataObjPolygonArray[i] = new google.maps.Polygon({
      paths: coordinates,
      strokeColor: color1,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color1,
      fillOpacity: 0.35,
      clickable: true,
      name: boroughDict[arrayLatLngObjs[i][1]].quartier,
      zone: boroughDict[arrayLatLngObjs[i][1]].Secteur,
      msgFR: arrayLatLngObjs[i][2],
    });

    message = arrayLatLngObjs[i][1];
    google.maps.event.addListener(
      dataObjPolygonArray[i],
      "mouseover",
      function () {
        this.setOptions({ fillColor: color2 });
        document.getElementById("borough-container").innerText =
          this.name + this.zone;
        document.getElementById("info-collect-container").innerHTML =
          `<div id="info-collect-container-mini">WHEN</div>` +
          garbageImage +
          this.msgFR;
        document.getElementById("borough-container-right").innerText =
          this.name + this.zone;
        play();
      }
    );
    google.maps.event.addListener(
      dataObjPolygonArray[i],
      "mouseout",
      function () {
        this.setOptions({ fillColor: color1 });
        document.getElementById("borough-container").innerText = "  ";
        document.getElementById("borough-container-right").innerText = "  ";
        document.getElementById("info-collect-container").innerText = "";
      }
    );
    dataObjPolygonArray[i].setMap(map);
  }
}
