var key = "57558716d569d47dc88cc798b3be6d77";
var key2 = "a138a0d7c78cb87048e65ad82a95d9cd";
var formEl = document.querySelector("form");
var cityTextEl = document.querySelector("#city")
var getDivs = document.querySelectorAll(".geoCities");
var watchlistArray = [];
if(localStorage.getItem("watchlist") != null){
    watchlistArray = JSON.parse(localStorage.getItem("watchlist"));
    displayWatchlist();

 }
//console.log("geocities " + getDivs[0])
//console.log(formEl)
//console.log(cityTextEl);
//"api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
lat = 51.5085;
lon = -0.1257;
var weatherUrl = ""
weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid="+ key
//getWeather(weatherUrl);

formEl.addEventListener('submit', searchForCity);

function searchForCity(event) {
    event.preventDefault();
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
        messageEl.text("No results found")
        $('#dialog').append(messageEl)
        console.log(messageEl)
       
        
    }
    else{

        for(i = 0; i < data.length; i++){
            getDivs[i].textContent = data[i].name + ", " + data[i].state + " " + data[i].country;
            getDivs[i].setAttribute('data-lat', data[i].lat)
            getDivs[i].setAttribute('data-lon', data[i].lon)

            
        }
        
        for(var i = 0; i < getDivs.length; i++){

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
             })


        }

    }
    $('#dialog').dialog('open'); 
    
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
      makeButton.className = "watchlist-btn d-block btn btn-primary m-2";  
      makeButton.textContent = newArr[i].city;
      makeButton.setAttribute("data-lat", newArr[i].lat);
      makeButton.setAttribute("data-lon", newArr[i].lon);
      getSection.appendChild(makeButton);

    }



}

$("#dialog").dialog({
    modal: false,
    autoOpen: false,
    title: "Choose a city",
    width: 300,
    height: 300
});