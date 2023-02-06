var key = "57558716d569d47dc88cc798b3be6d77";
var key2 = "a138a0d7c78cb87048e65ad82a95d9cd";
var formEl = document.querySelector("form");
var cityTextEl = document.querySelector("#city")
var getDivs = document.querySelectorAll(".geoCities");
console.log("geocities " + getDivs[0])
console.log(formEl)
console.log(cityTextEl);
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
  console.log(geoData);
  displayCities(geoData)

})
.catch(function (error) {
  console.error(error);
});

}

function displayCities(data){
    console.log("in display cities");
}