$(document).ready(function () {

  var city = localStorage.getItem('city'); 
  var cardSelector = $("#card"); 

  function getWeather() { 
    if (city == null) { 
      cardSelector.append("<p>Vous n'avez pas encore renseign&eacute; de ville.</p>"); 
    } else { 
      $("#card *:not(div)").remove();

      var myAPPID = "96da4e46c9bdb757a3acd836dc3a0320"; 

      console.log("http://api.openweathermap.org/data/2.5/weather?APPID=" + myAPPID + "&q=" + city + "&lang=fr");

      $.getJSON("http://api.openweathermap.org/data/2.5/weather?APPID=" + myAPPID +"&lang=fr&q=" + city, function (result) { // on mets le résultat dans une variable result qui vaut le code JSON qu'on voit dans le navigateur
        var cityName = result.name; 
        var weatherType = result.weather[0].description; 
        var iconCode = result.weather[0].icon; 
        var temp = result.main.temp; 
        var tempInCelsius = (temp - 273.15).toFixed(1); 
        var vWind = result.wind.speed;

        
        cardSelector.append("<ul><li>Ville : " + cityName + "</li><li>Temps : " + weatherType + 
        "</li><li> Température : " + tempInCelsius + " &deg;C</li><li>Vitesse de vent : "+vWind+" km/h</li></ul>");
        cardSelector.append("<img src='img/img/" + iconCode + ".png' alt='Weather Icon' width='80px' height='80px'>");

      });
    }
  }

  function submitForm() { 
    var mycity = $('input').val(); 
    if (mycity.length >= 3) { 
      localStorage.setItem("city", mycity); 
      city = mycity; 
      getWeather(); 
    } else { 
      alert('empty field'); 
    }
  }

  $('#getWeather').on('touchstart', function () { 
    submitForm(); 
  });

  $('form').submit(function (event) { 
    event.preventDefault(); 
    submitForm(); 
  });

  getWeather();
});