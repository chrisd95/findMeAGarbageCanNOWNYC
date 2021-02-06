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
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 12,
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

  // For loop of all recycling bins
  for (i = 0; i < recyclingbin.length; i++) {
    latVal = recyclingbin[i].Latitude;
    lngVal = recyclingbin[i].Longitude;
    latlng = { lat: latVal, lng: lngVal };
    console.log(latlng);
    new google.maps.Marker({
      position: latlng,
      map,
      title: "Recycle Bin #" + i,
      clickable: true,
    });
  }

  searchMarker = new google.maps.Marker({
    position: { lat: 40.85557, lng: -73.887565 },
    map,
    title: "Recycle Bin #1",
    clickable: true,
  });
}
