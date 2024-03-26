const apiKey = '9f25d16744d4dc11e33be66ead704742'; // Replace api key

const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const createWeatherCard =(cityName, weatherItem, index) => {
    // main weather card
    if(index === 0) {
        return `    <div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature:${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
        <h4>Wind:${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity:${weatherItem.main.humidity}%</h4>   
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png"  alt="weather-icon">
        <h4>${weatherItem.weather[0].description}</h4>
    </div>`;
// five day waether cards
    } else {
        return `<li class="card">
        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
        <h4>Temperature:${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
        <h4>Wind:${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity:${weatherItem.main.humidity}%</h4>   
    </li>`;
    }
}

const getWeatherDetails= (cityName, lat, lon) => {
    // const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt={cnt}&appid=${apiKey}`;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast=>{
        // filter to get forcasts per day
        // data.list.filter(forecast => {
          const forecastDate = new Date(forecast.dt_txt).getDate(); 
          if(!uniqueForecastDays.includes(forecastDate)){
            return uniqueForecastDays.push(forecastDate);
          }
        });

        //clearing previous weather data
        cityInput.value ="";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

       // creating and adding weather cards to localstorage
        fiveDaysForecast.forEach((weatherItem, index) => {

            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityInput, weatherItem, index));
            }
            });
    }).catch(() =>{
        alert("an error occured");
    });
    }

const saveAndAppendCity= (cityName) => {
    let searchHistory=JSON.parse(localStorage.getItem("searchHistory")) || [];
if (!searchHistory.includes(cityName)) {
searchHistory.push(cityName);
} ;  
localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
searchHistory=JSON.parse(localStorage.getItem("searchHistory"))
document.querySelector(".history-btns") .innerHTML="";
 for (let i = 0; i < searchHistory.length; i++) {
  let button=document.createElement("button")  ;
   button.textContent = searchHistory[i];
   document.querySelector(".history-btns") .appendChild(button);
   button.classList.add("location-btn");
 }
}


const getCityCoordinates =() => {
    // capture city name 
    const cityName = cityInput.value.trim();  
    saveAndAppendCity(cityName)
    // if city name is empty
    if(!cityName) return;

    // const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;

    // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)

    // get city coordinates from the API response
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&liimt=1&appid=${apiKey}`)

    // fetch (`https://api.openweathermap.org/geo/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}`)
        .then(response => response.json())
        .then(data => {
// console.log(data)
const {name, lat, lon} = data[0];
getWeatherDetails(name, lat, lon );
        }).catch(() =>{
            alert("an error occured");
        });
        
}

searchButton.addEventListener("click", getCityCoordinates);

// ----------------------------------------------------------------------------------------------------------------------------
const searchForm = document.getElementById('search-form');
// const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');





// searchForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const city = cityInput.value;
    
//     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
//     // fetch (`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}`)
//         .then(response => response.json())
//         .then(data => {
//             // Update current weather section with data
//             currentWeatherSection.innerHTML = `
//                 <h2>${data.name}</h2>
//                 <p>Temperature: ${data.main.temp} °C</p>
//                 <p>Weather: ${data.weather[0].description}</p>
//             `;

//         const weatherDataString = JSON.stringify(data);
//         // // Store the weather data in localStorage with a key
//         localStorage.setItem("data", weatherDataString);
//         })
//         .catch(error => console.error('Error fetching weather data:', error));

          
//     fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
//         .then(response => response.json())
//         .then(data => {
//             // Update forecast section with data
//             forecastSection.innerHTML = '';
//             data.list.forEach(item => {
//                 forecastSection.innerHTML += `
//                     <div>
//                         <p>Date: ${item.dt_txt}</p>
//                         <p>Temperature: ${item.main.temp} °C</p>
//                         <p>Weather: ${item.weather[0].description}</p>
//                     </div>
//                 `;
//             });
//         })
//         .catch(error => console.error('Error fetching forecast data:', error));
// });



// // const searchForm = document.getElementById('searchForm');
// // const cityInput = document.getElementById('cityInput');
// // const weatherInfo = document.getElementById('weatherInfo');
// // const searchHistory = document.getElementById('searchHistory');

// // searchForm.addEventListener('submit', function(event) {
// //     event.preventDefault();
// //     const city = cityInput.value;
// //     // Call a function to fetch weather data for the city
// //     // Update the UI with the weather information
// //     // Add the city to search history
// // });

// // // Function to fetch weather data from an API
// // function fetchWeatherData(city) {
// //     // Make API request to get weather data for the city
// // }

// // // Function to update UI with weather information
// // function updateWeatherInfo(weatherData) {
// //     // Display current and future weather conditions
// // }

// // // Function to add city to search history
// // function addToSearchHistory(city) {
// //     // Add the city to the search history list
// // }
