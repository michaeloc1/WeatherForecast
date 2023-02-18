var key = "57558716d569d47dc88cc798b3be6d77";
var key2 = "a138a0d7c78cb87048e65ad82a95d9cd";
var formEl = document.querySelector("form");
var cityTextEl = document.querySelector("#city")
var getDivs = document.querySelectorAll(".geoCities");
var errMessageEl = document.querySelector("#errMessage");
errMessageEl.style.display = "none"
var watchlistArray = [];
if(localStorage.getItem("watchlist") != null){
    watchlistArray = JSON.parse(localStorage.getItem("watchlist"));
    displayWatchlist();

 }
//console.log("geocities " + getDivs[0])
//console.log(formEl)
//console.log(cityTextEl);
//"api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
//lat = 51.5085;
//lon = -0.1257;
//var weatherUrl = ""
//weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid="+ key
//getWeather(weatherUrl);

formEl.addEventListener('submit', searchForCity);

function searchForCity(event) {
    event.preventDefault();
    errMessageEl.style.display = "none"
    if(cityTextEl.value === ""){
      errMessageEl.textContent = "Invalid input"
      errMessageEl.style.display = "block"
      return;
    }
    var city = cityTextEl.value;
    var makeGeoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + key
    
    fetch(makeGeoUrl)
.then(function (response) {
  if (!response.ok) {
    throw response.json();
  }

  return response.json();
})
.then(function (geoData) {
  // write query to page so user knows what they are viewing
  cityTextEl.value = "";
  console.log(geoData);
  displayCities(geoData);

})
.catch(function (error) {
  console.error(error);
});

}

function displayCities(data){

   for(let i = 0; i < getDivs.length; i++){
    getDivs[i].textContent = ""
   }


    if(data.length === 0){
        var messageEl = $("<h1>");
        //messageEl.text("No results found")
        //$('#dialog').append(messageEl)
        //console.log(messageEl)
        errMessageEl.textContent = "No results found"
        errMessageEl.style.display = "block"
       
        
    }
    else{

        for(i = 0; i < data.length; i++){
            getDivs[i].textContent = data[i].name + ", " + data[i].state + " " + data[i].country;
            getDivs[i].setAttribute('data-lat', data[i].lat)
            getDivs[i].setAttribute('data-lon', data[i].lon)


            
        }
        
        
        for(var i = 0; i < data.length; i++){

            getDivs[i].addEventListener("mouseover", function(event){
             // get the div currently moused over
              var currentDiv = event.currentTarget;
              currentDiv.style.cursor = "pointer";
             })

             getDivs[i].addEventListener("mouseout", function(event){
                var currentDiv = event.currentTarget;
                currentDiv.style.cursor = "pointer";
              })

              getDivs[i].addEventListener("click", function(event){
                var currentDiv = event.currentTarget;
                var getText = currentDiv.textContent;
                var getLat = currentDiv.getAttribute("data-lat");
                var getLon = currentDiv.getAttribute("data-lon"); 
                //console.log(getLat);
                //console.log(getText);
                $('#dialog').dialog('close');
                addToWatchlist(getText, getLat, getLon);
                getCurrentWeather(getText, getLat, getLon)
                getWeather(getLat, getLon)
               // getForcastWeather(getLat, getLon)

             })


        }
        $('#dialog').dialog('open');
    }
   // $('#dialog').dialog('open'); 
    
}

function addToWatchlist(city, lat, lon){

    watchlistArray = jQuery.grep(watchlistArray , function (value) {
        return value.city != city;
      });

    watchlistArray.push(
        {
            city: city,
            lat: lat,
            lon: lon

        }

    )

    localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
    displayWatchlist();
  

}

function displayWatchlist(){
    var getSection = document.querySelector(".watchlist");
    var newArr = JSON.parse(localStorage.getItem("watchlist"));
    newArr.reverse();
    console.log(newArr.length)
    while (getSection.firstChild) {
        getSection.removeChild(getSection.firstChild);
    }
    for(i = 0; i < newArr.length; i++){
      var makeButton = document.createElement("button");
      makeButton.className = "watchlist-btn d-block btn btn-secondary m-2";  
      makeButton.textContent = newArr[i].city;
      makeButton.setAttribute("data-lat", newArr[i].lat);
      makeButton.setAttribute("data-lon", newArr[i].lon);
      getSection.appendChild(makeButton);

      makeButton.addEventListener("click", function(event){
        var currentButton = event.currentTarget;
        var buttonText = currentButton.textContent;
        var buttonLat = currentButton.getAttribute("data-lat");
        var buttonLon = currentButton.getAttribute("data-lon");
        getCurrentWeather(buttonText, buttonLat, buttonLon);
        getWeather(buttonLat, buttonLon);
 
     })

    }



}

function getCurrentWeather(city, lat, lon){
  //https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid={API key}&units=imperial
  var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" +lon + "&appid=" + key + "&units=imperial"
  console.log(currentWeatherURL)
  fetch(currentWeatherURL)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }
  
    return response.json();
  })
  .then(function (data) {
    console.log(data)
    displayCurrentWeather(city, data);
   
  
  })
  .catch(function (error) {
    console.error(error);
  });
}

function getForcastWeather(lat, lon){
  var getForcastUrl = "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + lon + "&cnt=5&appid=" + key + "&units=imperial";
  console.log(getForcastUrl)
  fetch(getForcastUrl)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }
  
    return response.json();
  })
  .then(function (data) {
    console.log(data)
  
  })
  .catch(function (error) {
    console.error(error);
  });
  }

function getWeather(lat, lon){
  weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid="+ key + "&units=imperial"
  console.log(weatherUrl)

  fetch(weatherUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
    
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      displayForcast(data);
      
    
    })
    .catch(function (error) {
      console.error(error);
    });
  
}

function displayCurrentWeather(currentCity, currentData){
   const currentCityEl = document.querySelector("#current-city");
   const currentDate = new Date();
   const currentDay = currentDate.getDate();
   const currentMonth = currentDate.getMonth();
   const currentYear = currentDate.getFullYear();
   const currentDateString = " (" + currentMonth + "/" + currentDay + "/" + currentYear + ")";
   const currentIconEl = document.querySelector("#current-icon");
   currentIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentData.weather[0].icon + "@2x.png") 
   currentCityEl.textContent = currentCity + currentDateString;
   const currentTempEl = document.querySelector("#current-temp");
   currentTempEl.textContent = "Temp: " + currentData.main.temp + "\u00B0" + "F";
   const currentWindEl = document.querySelector("#current-wind");
   currentWindEl.textContent = "Wind: " + currentData.wind.speed + " MPH";
   const currentHumidityEl = document.querySelector("#current-humidity");
   currentHumidityEl.textContent = "Humidity: " + currentData.main.humidity + "%";
  }

  function displayForcast(forcastData){
    var forcastTempEls = document.querySelectorAll(".forcast-temp");
    var forcastIconEls = document.querySelectorAll(".forcast-icon");
    var forcastWindEls = document.querySelectorAll(".forcast-wind");
    var forcastHumidityEls = document.querySelectorAll(".forcast-humidity");
    var cardHeaderEls = document.querySelectorAll(".card-header")
    var counter = 0
    for(let i = 0; i < forcastData.list.length; i++){
      //console.log(forcastData.list[i].dt_txt);

      var forcastDate = forcastData.list[i].dt_txt;
      if(forcastDate.includes("12:00:00")){
        //console.log(forcastData.list[i].dt_txt);
        cardHeaderEls[counter].textContent = forcastData.list[i].dt_txt;
        forcastTempEls[counter].textContent = "Temp: " + forcastData.list[i].main.temp;
        forcastIconEls[counter].setAttribute("src", "http://openweathermap.org/img/wn/" + forcastData.list[i].weather[0].icon + ".png");
        forcastWindEls[counter].textContent = "Wind: " + forcastData.list[i].wind.speed;
        forcastHumidityEls[counter].textContent = "Humidity: " + forcastData.list[i].main.humidity;
        counter++;

      }
    }
  }

$("#dialog").dialog({
    modal: true,
    autoOpen: false,
    title: "Choose a city",
    width: 300,
    height: 300,
    fadeDuration: 300,
    autoResize:true,
    minHeight: 'auto'
});
