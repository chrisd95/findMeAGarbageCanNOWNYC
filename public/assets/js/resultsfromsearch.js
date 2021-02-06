// Written by: Christopher Dip
// Date: January 13th 2020
// Best Company Ever

// This code uses google maps API
// var data = "<%= data.search %>";  <-- uncomment if not called in ejs
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
    center: { lat: 40.99, lng: -95.7129 },
    zoom: 4,
  },
};

// Initialize google map API
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: countries["address"].zoom,
    center: countries["address"].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
    styles: mapstyling,
  });
  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById("info-content"),
  });

  places = new google.maps.places.PlacesService(map);

  // Parse the search address
  // converts into UTF-8 (apostrophe(&#39) ----> ')
  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  searchAddress = decodeHtml(searchAddress);
  var searchSequence = searchAddress.split(" ");
  var searchSequenceString = "";
  for (i = 0; i < searchSequence.length; i++) {
    searchSequenceString += searchSequence[i];
    if (i != searchSequence.length - 1) {
      searchSequenceString += "+";
    }
  }

  // GET request to google geocode API
  $.getJSON(
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      searchSequenceString +
      "&key=AIzaSyACJ80lQU3R6Xf-s0aqSGzS84lZ3qn6Ij8",
    null,
    function (searchAddress) {
      if (searchAddress.results.length > 0) {
        placeTwo = searchAddress;
      }
    }
  );
  setTimeout(() => {
    panToSearchLocation();
    addMarker();
  }, 3000);
}

function panToSearchLocation() {
  if (placeTwo.results[0].geometry) {
    map.panTo(placeTwo.results[0].geometry.location);
    map.setZoom(13);
    search();
  } else {
    console.log("invalid search");
  }
}

var opened = false;
function addMarker() {
  let latlng = placeTwo.results[0].geometry.location;
  let latlngStr =
    latlng.lat.toString().slice(0, 8) + "," + latlng.lng.toString().slice(0, 8);
  let randInt = (
    Math.floor((Math.random() * (600000 - 300000) + 300000) / 1000) * 1000
  ).toString();
  console.log(randInt);
  const searchImg =
    "https://maps.googleapis.com/maps/api/streetview?size=500x250&location=" +
    latlngStr +
    "&key=AIzaSyACJ80lQU3R6Xf-s0aqSGzS84lZ3qn6Ij8";
  const contentString =
    '<div id="content" class="d-flex flex-column justify-content-center align-items-center align-content-center">' +
    '<div id="siteNotice">' +
    "<img src=" +
    '"' +
    searchImg +
    '"' +
    'alt="No images available width = "500px" height="250px">' +
    "</div>" +
    '<h2 id="firstHeading" class="address-text pt-3">' +
    searchAddress +
    "</h2>" +
    '<div id="bodyContent">' +
    "<p><b>Current estimate </b> dated January 11th 2021</p>" +
    '<h1 class="pl-4"> $' +
    randInt +
    "</h1>" +
    '<p class="pl-5">Powered by Crazy AI</p>';
  "</div>" + "</div>";
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });
  const searchMarker = new google.maps.Marker({
    position: latlng,
    map,
    title: "Your House",
    clickable: true,
  });

  infowindow.open(map, searchMarker);
  opened = true;
  searchMarker.addListener("click", () => {
    if (opened === false) {
      infowindow.open(map, searchMarker);
      opened = true;
    } else {
      infowindow.close();
      opened = false;
    }
  });
  map.addListener("click", () => {
    if (opened === true) {
      infowindow.close();
      opened = false;
    }
  });
}

// Search for schools, parcs, hotels, etc. in the selected city, within the viewport of the map.
function search() {
  const search = {
    bounds: map.getBounds(),
    // You can pick between different different types
    // Cafes, bus stations, plumber, etc.
    // Ref: https://developers.google.com/places/supported_types
    types: ["lodging"],
  };
  places.nearbySearch(search, (results, status, pagination) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();

      // Create a marker for each location found, and
      // assign a letter of the alphabetic to each marker icon.
      for (let i = 0; i < results.length; i++) {
        const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
        const markerIcon = MARKER_PATH + markerLetter + ".png";

        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon,
        });
        // If the user clicks a location marker, show the details of that hotel
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], "click", showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
}

function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

function dropMarker(i) {
  return function () {
    markers[i].setMap(map);
  };
}

function addResult(result, i) {
  const results = document.getElementById("results");
  const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
  const markerIcon = MARKER_PATH + markerLetter + ".png";
  const tr = document.createElement("tr");
  tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";

  tr.onclick = function () {
    google.maps.event.trigger(markers[i], "click");
  };
  const iconTd = document.createElement("td");
  const nameTd = document.createElement("td");
  const icon = document.createElement("img");
  icon.src = markerIcon;
  icon.setAttribute("class", "placeIcon");
  icon.setAttribute("className", "placeIcon");
  const name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

function clearResults() {
  const results = document.getElementById("results");
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  const marker = this;
  places.getDetails(
    { placeId: marker.placeResult.place_id },
    (place, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      infoWindow.open(map, marker);
      buildIWContent(place);
    }
  );
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById("iw-icon").innerHTML =
    '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
  document.getElementById("iw-url").innerHTML =
    '<b><a href="' + place.url + '">' + place.name + "</a></b>";
  document.getElementById("iw-address").textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById("iw-phone-row").style.display = "";
    document.getElementById("iw-phone").textContent =
      place.formatted_phone_number;
  } else {
    document.getElementById("iw-phone-row").style.display = "none";
  }

  // Assign a star ratings to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    let ratingHtml = "";

    for (let i = 0; i < 5; i++) {
      if (place.rating < i + 0.5) {
        ratingHtml += "&#10025;";
      } else {
        ratingHtml += "&#10029;";
      }
      document.getElementById("iw-rating-row").style.display = "";
      document.getElementById("iw-rating").innerHTML = ratingHtml;
    }
  } else {
    document.getElementById("iw-rating-row").style.display = "none";
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    let fullUrl = place.website;
    let website = String(hostnameRegexp.exec(place.website));

    if (!website) {
      website = "http://" + place.website + "/";
      fullUrl = website;
    }
    document.getElementById("iw-website-row").style.display = "";
    document.getElementById("iw-website").textContent = website;
  } else {
    document.getElementById("iw-website-row").style.display = "none";
  }
}
