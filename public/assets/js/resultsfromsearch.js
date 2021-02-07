let map;
let places;
let infoWindow;
let markers = [];
let autocomplete;
let placeTwo;
let searchImage;
const countryRestrict = { country: "us" };

// close X-button
document.getElementById("close-button").addEventListener("click", function () {
  console.log("closing");
  document.getElementById("on-load-message").style.display = "none";
  map.setZoom(12);
});

// Map is initially centered to North America coordinates
const countries = {
  address: {
    // Initial coordinates of the map
    center: { lat: 45.5, lng: -73.65 },
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

  function convertToArrayOfLatLng(myArray) {
    let newArray = [];
    for (j = 0; j < myArray.length; j++) {
      let latVal = myArray[j][1];
      let lngVal = myArray[j][0];
      newArray.push({ lat: latVal, lng: lngVal });
    }
    return newArray;
  }

  var arrayLatLngObjs = [];
  for (i = 0; i < orduremenagere.features.length; i++) {
    let type = orduremenagere.features[i].geometry.type;
    if (type == "MultiPolygon") {
      for (
        j = 0;
        j < orduremenagere.features[i].geometry.coordinates[0].length;
        j++
      ) {
        arrayLatLngObjs.push([
          convertToArrayOfLatLng(
            orduremenagere.features[i].geometry.coordinates[0][j]
          ),
          orduremenagere.features[i].properties.SECTEUR,
          orduremenagere.features[i].properties.MESSAGE_EN,
        ]);
      }
    }
    if (type == "Polygon") {
      arrayLatLngObjs.push([
        convertToArrayOfLatLng(
          orduremenagere.features[i].geometry.coordinates[0]
        ),
        orduremenagere.features[i].properties.SECTEUR,
        orduremenagere.features[i].properties.MESSAGE_EN,
      ]);
    }
  }

  console.log(recyclage);

  var infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(150, 50),
  });
  orduremenagerePolygonArray = [];
  for (i = 0; i < arrayLatLngObjs.length; i++) {
    var coordinates = arrayLatLngObjs[i][0];
    orduremenagerePolygonArray[i] = new google.maps.Polygon({
      paths: coordinates,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      clickable: true,
      name: boroughDict[arrayLatLngObjs[i][1]].quartier,
      zone: boroughDict[arrayLatLngObjs[i][1]].Secteur,
      msgFR: arrayLatLngObjs[i][2],
    });
    google.maps.event.addListener(map, "click", function () {
      infowindow.close();
    });

    message = arrayLatLngObjs[i][1];
    google.maps.event.addListener(
      orduremenagerePolygonArray[i],
      "mouseover",
      function () {
        this.setOptions({ fillColor: "#00FF00" });
        document.getElementById("borough-container").innerText =
          this.name + this.zone;
        document.getElementById("info-collect-container").innerText =
          this.msgFR + this.name + this.zone;
        document.getElementById("borough-container-right").innerText =
          this.name + this.zone;
      }
    );
    google.maps.event.addListener(
      orduremenagerePolygonArray[i],
      "mouseout",
      function () {
        this.setOptions({ fillColor: "#FF0000" });
        document.getElementById("borough-container").innerText = "  ";
        document.getElementById("borough-container-right").innerText = "  ";
        document.getElementById("info-collect-container").innerText = "";
      }
    );
    // google.maps.event.addListener(
    //   orduremenagerePolygonArray[i],
    //   "click",
    //   function (event) {
    //     infowindow.setContent(message);
    //     if (event) {
    //       point = event.latLng;
    //     }
    //     infowindow.setPosition(point);
    //     infowindow.open(map);
    //   }
    // );
    orduremenagerePolygonArray[i].setMap(map);
  }
}
