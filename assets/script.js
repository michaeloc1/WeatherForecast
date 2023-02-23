var key = "57558716d569d47dc88cc798b3be6d77";
var key2 = "a138a0d7c78cb87048e65ad82a95d9cd";
var formEl = document.querySelector("form");
var cityTextEl = document.querySelector("#city")
var getDivs = document.querySelectorAll(".geoCities");
var errMessageEl = document.querySelector("#errMessage");
errMessageEl.style.display = "none"
//store watchlist in an array if it exists and call display watchlist function
var watchlistArray = [];
if(localStorage.getItem("watchlist") != null){
    watchlistArray = JSON.parse(localStorage.getItem("watchlist"));
    displayWatchlist();

 }

formEl.addEventListener('submit', searchForCity);

//will get lat and lon coordinates of city user enters and calls displaycities function
function searchForCity(event) {
    event.preventDefault();
    errMessageEl.style.display = "none"
    if(cityTextEl.value === ""){
      errMessageEl.textContent = "Invalid input"
      errMessageEl.style.display = "block"
      return;
    }
    var city = cityTextEl.value;
    var makeGeoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + key
    
    fetch(makeGeoUrl)
.then(function (response) {
  if (!response.ok) {
    throw response.json();
  }

  return response.json();
})
.then(function (geoData) {

  cityTextEl.value = "";
  console.log(geoData);
  displayCities(geoData);

})
.catch(function (error) {
  console.error(error);
});

}

//will display cities in a modal for user to choose one.  If no cities found
//it will display message to user. I also give attributes of city name, lat
//and lon so when the user clicks on a city the attributes are passed to
//th functions that display the weather. Functions that are called are
//addToWatchlist, getWeather, and getCurrentWeather
function displayCities(data){

   for(let i = 0; i < getDivs.length; i++){
    getDivs[i].textContent = ""
   }


    if(data.length === 0){
        var messageEl = $("<h1>");

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
                $('#dialog').dialog('close');
                addToWatchlist(getText, getLat, getLon);
                getCurrentWeather(getText, getLat, getLon)
                getWeather(getLat, getLon)


             })


        }
        $('#dialog').dialog('open');
    }

    
}

//adds the city that user clicked on and stores it in local storage
//along with the lat and lon. Calls displayWatchlist function
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

//displays the watchlist as buttons.  Gets the watchlist from local storage
//reverses the array to display the last search first, sets attributes of
//lat and lon to be used when the user clicks on a saved city. When a 
//saved city is clicked on getCurrentWeather and getWeather are called
//There is also a delete button made that allows user to delete saved
//city from the watchlist.
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
      makeButton.className = "watchlist-btn btn btn-secondary m-2";  
      makeButton.textContent = newArr[i].city;
      makeButton.setAttribute("data-lat", newArr[i].lat);
      makeButton.setAttribute("data-lon", newArr[i].lon);
      var makeDeleteButton = document.createElement("button");
      makeDeleteButton.className = "btn btn-danger"
      makeDeleteButton.textContent = "X";
      makeButton.style.display = "inline-block"
      makeDeleteButton.style.display = "inline-block";
      
      var makeDiv = document.createElement("div");
      getSection.appendChild(makeDiv)
      makeDiv.appendChild(makeButton)
      makeDiv.appendChild(makeDeleteButton)

      makeDeleteButton.addEventListener("click", function(event){
       var deleteText = this.previousSibling.textContent;
       watchlistArray = jQuery.grep(watchlistArray , function (value) {
        return value.city != deleteText;
      });
      localStorage.setItem("watchlist", JSON.stringify(watchlistArray));
        this.parentNode.removeChild( this.previousSibling );
        this.remove();

      })

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

//gets current weather from passed in lat and lon. City name is also passed
//in but that just gets passed on to the displayCurrentWeather function
function getCurrentWeather(city, lat, lon){
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

//gets weather forcast from lat and lon and calls displayForcast
function getWeather(lat, lon){
  weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid="+ key + "&units=imperial"
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
//displays the weather data into the html elements on the webpage
//The data displayed is city, date, the icon of current weather
//temp, wind, and humidity
function displayCurrentWeather(currentCity, currentData){
   const currentCityEl = document.querySelector("#current-city");
   const currentDateString = " (" + dayjs().format("M/D/YYYY") + ")";
   const currentIconEl = document.querySelector("#current-icon");
   currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + currentData.weather[0].icon + "@2x.png") 
   currentCityEl.textContent = currentCity + currentDateString;
   const currentTempEl = document.querySelector("#current-temp");
   currentTempEl.textContent = "Temp: " + currentData.main.temp + "\u00B0" + " F";
   const currentWindEl = document.querySelector("#current-wind");
   currentWindEl.textContent = "Wind: " + currentData.wind.speed + " MPH";
   const currentHumidityEl = document.querySelector("#current-humidity");
   currentHumidityEl.textContent = "Humidity: " + currentData.main.humidity + "%";
  }

  //displays the forcast in the html card elements on the webpage
  //The data is for 5 days in three hour increments so I have to get
  //it to display one per day.  I do this by checking the dt_txt in the
  //data to see if it includes 12:00:00. If it does then I populate the 
  //data onto the html elements.  I have 5 html elements to populate
  //so I use a counter to increment the element
  function displayForcast(forcastData){
    var forcastTempEls = document.querySelectorAll(".forcast-temp");
    var forcastIconEls = document.querySelectorAll(".forcast-icon");
    var forcastWindEls = document.querySelectorAll(".forcast-wind");
    var forcastHumidityEls = document.querySelectorAll(".forcast-humidity");
    var cardHeaderEls = document.querySelectorAll(".card-header")
    var counter = 0;
    
    for(let i = 0; i < forcastData.list.length; i++){

      var forcastDate = forcastData.list[i].dt_txt;
      if(forcastDate.includes("12:00:00")){
        const forcastDateString = " (" + dayjs(forcastData.list[i].dt_txt).format("M/D/YYYY") + ")";
        cardHeaderEls[counter].textContent = forcastDateString;
        forcastTempEls[counter].textContent = "Temp: " + forcastData.list[i].main.temp + "\u00B0" + " F";
        forcastIconEls[counter].setAttribute("src", "https://openweathermap.org/img/wn/" + forcastData.list[i].weather[0].icon + ".png");
        forcastWindEls[counter].textContent = "Wind: " + forcastData.list[i].wind.speed + " MPH";
        forcastHumidityEls[counter].textContent = "Humidity: " + forcastData.list[i].main.humidity + "%";
        counter++;

      }
    }
  }

  //sets up modal that is used to display cities
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
