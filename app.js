const weather = document.querySelector(".weather");
const weatherForm = document.querySelector(".weather__search");
const input = weatherForm.querySelector("input");
const btnSubmit = weatherForm.querySelector("button");
const weatherInfo = document.querySelector(".weather__info");

function wrongCity() {
  const wrong = document.querySelector(".weather__wrong");
  const infoClass = weatherInfo.classList.contains("show");

  if(infoClass === true) {
    weatherInfo.classList.remove("show");
  }

  wrong.classList.add("show");
  setTimeout(() => {
    wrong.classList.remove("show");
    input.value = "";
  }, 5000)
}

const searchCity = async (city) => {
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const data = await response.json();
    const cityInfo = data.results[0];

    return cityInfo;
  } catch(err) {
    wrongCity();
  }
}

const searchWeather = async (lat, lon) => {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`);
    const data = await response.json();

    return data;
  } catch(err) {
    console.error(err);
  }
}

const buildInfo = async (cityName) => {
  const weatherCity = document.querySelector(".weather__city");
  const weatherTemperature = document.querySelector(".weather__temperature");
  const weatherTable = document.querySelector(".weather__table");
  const weatherCountry = weatherTable.querySelector(".country");
  const weatherTimezone = weatherTable.querySelector(".timezone");
  const weatherPopulation = weatherTable.querySelector(".population");
  const weatherForecast = weatherTable.querySelector(".forecast");

  const cityData = await searchCity(cityName);
  const lat = cityData.latitude;
  const lon = cityData.longitude;

  const weatherData = await searchWeather(lat, lon);

console.log(cityData);
console.log(weatherData);
  if(cityData.country == undefined) { // example like hong kong
    weatherCountry.textContent = cityData.name;
  } else {
    weatherCountry.textContent = cityData.country;
  }

  if(cityData.population == undefined) { // example searching IATA code like icn
    weatherPopulation.textContent = "-";
  } else {
    weatherPopulation.textContent = cityData.population.toLocaleString();
  }

  weatherCity.textContent = cityData.name;
  weatherTimezone.textContent = weatherData.timezone;
  weatherTemperature.textContent = `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`;
  weatherForecast.firstChild.textContent = `Low: ${weatherData.daily.temperature_2m_min} ${weatherData.current_units.temperature_2m}`;
  weatherForecast.lastChild.textContent = `Max: ${weatherData.daily.temperature_2m_max} ${weatherData.current_units.temperature_2m}`;

  input.value = "";
  weatherInfo.classList.add("show");
  changeDayNight(weatherData.current.is_day);
}

function changeDayNight(day) {
  if(day) {
    weather.classList.remove("night");
  } else {
    weather.classList.add("night");
  }
}
function handleSubmit(event) {
  event.preventDefault();
  const city = input.value;
  if(input.value !== "") {
    buildInfo(city);
  }
}

weatherForm.addEventListener("submit", handleSubmit);
