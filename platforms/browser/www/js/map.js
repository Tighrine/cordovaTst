var map, vlibMap;

function initMap() {
  var uluru = { lat: -25.363, lng: 131.044 };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });

  vlibMap = new google.maps.Map(document.getElementById('vlib-map'), {
    zoom: 4,
    center: uluru
  });

  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
function getWeather(myLatLng) {
  var myAPPID = "96da4e46c9bdb757a3acd836dc3a0320";
  var cardSelector = $("#card");

  $.getJSON("http://api.openweathermap.org/data/2.5/weather?APPID=" + myAPPID + "&lat=" + myLatLng.lat + "&lon=" + myLatLng.lng + "&lng=fr", function (result) {
    var cityName = result.name;
    var weatherType = result.weather[0].description;
    var iconCode = result.weather[0].icon;
    var temp = result.main.temp;
    var tempInCelsius = (temp - 273.15).toFixed(1);
    var vWind = result.wind.speed;
    localStorage.setItem("city", cityName);

    cardSelector.html('');
    cardSelector.append("<ul><li>Ville : " + cityName + "</li><li>Temps : " + weatherType + "</li><li> Température : "
      + tempInCelsius + " &deg;C</li><li>Vitesse de vent : " + vWind + " km/h</li></ul>");
    cardSelector.append("<img src='img/BlogDuMMI-icons/" + iconCode + ".png' alt='Weather Icon' width='80px' height='80px'>");
  });
}
var options = { enableHighAccuracy: true };

$('#currentPos').click(function () {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
});

function onSuccess(position) {
  var myLatLng = { lat: position.coords.latitude, lng: position.coords.longitude }

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Your location'
  });
  marker.setMap(map);

  getWeather(myLatLng);
}

function onError(error) {
  alert('code: ' + error.code + '\n' +
    'message: ' + error.message + '\n');
}

var locations = new Array();
var names = new Array();

var listVlib = $('#vlibList');

$('#getStations1').click(function () {
  var cityName = $('#cityStation').val();

  navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

  function onSuccess(position) {
    var myLatLng = { lat: position.coords.latitude, lng: position.coords.longitude }
    names.push('Votre position');
    locations.push(myLatLng);
  }

  function onError(error) {
    alert('code: ' + error.code + '\n' +
      'message: ' + error.message + '\n');
  }

  $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=" + cityName + "&apiKey=aac79866ac9a36e4f37c8d08d5791763b6adfbe3", function (result) {
    listVlib.html("");
    for (var i = 0; i < result.length; i++) {
      if (parseInt(result[i].available_bikes) > 5) {
        listVlib.append("<ul><li>Station : " + result[i].name + "</li>Vélo dispo : " + result[i].available_bikes + "<li>Adresse : " + result[i].address + "</li></ul>");
        var pos = { lat: result[i].position.lat, lng: result[i].position.lng };

        locations.push(pos);
        names.push(result[i].name);
      }
      console.log(locations);
      var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
          position: location,
          label: names[i]
        });
      });

      // Add a marker clusterer to manage the markers.
      var markerCluster = new MarkerClusterer(vlibMap, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }
  });
});

$('#getStations2').click(function () {
  var cityName = $('#cityStation1').val();

  $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=" + cityName + "&apiKey=aac79866ac9a36e4f37c8d08d5791763b6adfbe3", function (result) {
    listVlib.html("");
    for (var i = 0; i < result.length; i++) {
      if (parseInt(result[i].available_bikes) > 5) {
        listVlib.append("<ul><li>Station : " + result[i].name + "</li>Vélo dispo : " + result[i].available_bikes + "<li>Adresse : " + result[i].address + "</li></ul>");
        var pos = { lat: result[i].position.lat, lng: result[i].position.lng };

        locations.push(pos);
        names.push(result[i].name);
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

      function onSuccess(position) {
        var myLatLng = { lat: position.coords.latitude, lng: position.coords.longitude }
        locations.push(myLatLng);
        names.push("Votre position");
      }

      function onError(error) {
        alert('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
      }

      var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
          position: location,
          label: names[i]
        });
      });

      var markerCluster = new MarkerClusterer(vlibMap, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }

  });
});