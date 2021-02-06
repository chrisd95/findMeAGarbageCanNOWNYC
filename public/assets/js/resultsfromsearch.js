let map;
let places;
let infoWindow;
let markers = [];
let autocomplete;
let placeTwo;
let searchImage;
const countryRestrict = { country: "us" };
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";

const hostnameRegexp = new RegExp("^https?://.+?/");

// Map is initially centered to North America coordinates
const countries = {
  address: {
    // Initial coordinates of the map
    center: { lat: 45.59, lng: -73.7 },
    zoom: 11,
  },
};

// Initialize google map API
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: countries["address"].zoom,
    center: countries["address"].center,
    mapTypeControl: true,
    panControl: true,
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
          orduremenagere.features[i].properties.MESSAGE_FR,
        ]);
      }
    }
    if (type == "Polygon") {
      arrayLatLngObjs.push([
        convertToArrayOfLatLng(
          orduremenagere.features[i].geometry.coordinates[0]
        ),
        orduremenagere.features[i].properties.SECTEUR,
        orduremenagere.features[i].properties.MESSAGE_FR,
      ]);
    }
  }

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
      name: boroughDict[arrayLatLngObjs[i][1]],
      msgFR: arrayLatLngObjs[i][2],
    });
    google.maps.event.addListener(map, "click", function () {
      infowindow.close();
    });

    message = arrayLatLngObjs[i][1];
    orduremenagerePolygonArray[i].infoWindow = new google.maps.InfoWindow({
      size: new google.maps.Size(150, 50),
    });

    google.maps.event.addListener(
      orduremenagerePolygonArray[i],
      "mouseover",
      function () {
        this.setOptions({ fillColor: "#00FF00" });
        document.getElementById("borough-container").innerText = this.name;
        document.getElementById(
          "info-collect-container"
        ).innerText = this.msgFR;
      }
    );

    google.maps.event.addListener(
      orduremenagerePolygonArray[i],
      "mouseout",
      function () {
        this.setOptions({ fillColor: "#FF0000" });
        document.getElementById("borough-container").innerText = "";
        document.getElementById("info-collect-container").innerText = "";
      }
    );

    google.maps.event.addListener(
      orduremenagerePolygonArray[i],
      "click",
      function (event) {
        infowindow.setContent(message);
        if (event) {
          point = event.latLng;
        }
        infowindow.setPosition(point);
        infowindow.open(map);
      }
    );

    orduremenagerePolygonArray[i].setMap(map);
  }

  //Find Garbage NYC
  // For loop of all recycling bins
  const icons = "https://i.ibb.co/wL4prx4/delete.png";

  for (i = 0; i < recyclingbin.length; i++) {
    latVal = recyclingbin[i].Latitude;
    lngVal = recyclingbin[i].Longitude;
    latlng = { lat: latVal, lng: lngVal };
    new google.maps.Marker({
      position: latlng,
      map,
      title: "Recycle Bin #" + i,
      clickable: true,
      icon: icons,
    });

    // Add feature to say that garbage is full

    // Add localizing feature
  }
}
