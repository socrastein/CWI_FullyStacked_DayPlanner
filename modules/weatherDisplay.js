const API_KEY="WEATHERAPI_API_KEY"; // weather api key here...

// async funtion to fetch current weather for Boise
async function getWeather() {

    try {

        /**
         * Makes a GET request to WeatherAPI for current weather in Boise
         * 'aqi=no' disables air quality data 
         */
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Boise&aqi=no`,
        );

        // Parse the response JSON into a Javascript object
        const data = await response.json();

        // Extract the temperature in fahrenheit from the response
        const temp = data.current.temp_f;

        // Extract the weather condition text (e.g, "cloudy, sunny, ...")
        const condition = data.current.condition.text;

        // Extract the weather icon URL
        const icon = "https:" + data.current.condition.icon;

        // Updates the HTML elements with the weather info with respect to their ids.
        document.getElementById("temperature").textContent = `${temp}°F`;
        document.getElementById("weather-description").textContent = condition;
        document.getElementById("weather-icon").src = icon;
    } catch(error) {
        // Catch and log errors (network issues, invalid API key, ...)
        console.error("Weather error:", error);
    }
}

export { getWeather };