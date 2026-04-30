import "../styling/weatherDisplay.css";

import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import appSettings, { useAppSettings } from "./appSettings";

const API_KEY = "63b4c58720ac4505abc204820260503";

// For fetching new data if cached data is older than 10 minutes
const CACHE_DURATION_MS = 10 * 60 * 1000;

interface WeatherData {
  location: { name: string };
  current: {
    temp_c: number;
    temp_f: number;
    feelslike_c: number;
    feelslike_f: number;
    humidity: number;
    wind_mph: number;
    wind_kph: number;
    condition: { text: string; icon: string };
  };
}

/**
 * Initial mounting of the weather display component.
 * This function should only be called once when the app loads.
 */
export function loadWeatherDisplay() {
  const container = document.getElementById("weatherDisplay");
  if (!container) throw new Error("weatherDisplay container not found");

  createRoot(container).render(<WeatherDisplay />);
}

/**
 * Handles fetching and displaying the current weather for a specified city.
 * It uses caching to avoid unnecessary API calls. Display updates when
 * the temp unit changes. Clicking the readout opens an expanded overlay with more details.
 */
function WeatherDisplay() {
  const { tempUnit } = useAppSettings();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Reset stale data immediately so we don't show the old city's weather
    // while the new fetch is in flight.
    setWeatherData(null);
    setError(false);

    const fetchData = () => {
      loadWeather(appSettings.city)
        .then((data) => {
          setWeatherData(data);
          setError(false);
        })
        .catch((error) => {
          setError(true);
          console.error("Failed to load weather data:", error);
        });
    };

    fetchData(); // initial load

    // Set up interval to refresh data every 10 minutes
    // This ensures we get updated weather information without needing a page refresh.
    const interval = setInterval(fetchData, CACHE_DURATION_MS);
    return () => clearInterval(interval);
  }, [appSettings.city]);

  if (error) return <p>⛓️‍💥</p>;
  if (!weatherData) return <p className="weatherLoadingText">Loading...</p>;

  return (
    <div className="weather-container">
      <WeatherReadout
        data={weatherData}
        temperatureUnit={tempUnit}
        onClick={() => setIsExpanded(true)}
      />
      {isExpanded && (
        <WeatherDetailOverlay
          data={weatherData}
          temperatureUnit={tempUnit}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}

/**
 * Displays a minimial readout, just weather condition icon and temperature.
 */
function WeatherReadout({
  data,
  temperatureUnit,
  onClick,
}: {
  data: WeatherData;
  temperatureUnit: "Celsius" | "Fahrenheit";
  onClick: () => void;
}) {
  const temperature =
    temperatureUnit === "Celsius" ? data.current.temp_c : data.current.temp_f;

  const tempUnit = temperatureUnit === "Celsius" ? "°C" : "°F";
  const iconUrl = "https:" + data.current.condition.icon;

  return (
    <div className="weather-readout" onClick={onClick}>
      {/* Current condition icon */}
      <img src={iconUrl} alt={data.current.condition.text} />
      {/* Current temperature matching temp unit settings */}
      <p>
        {Math.round(temperature)}
        {tempUnit}
      </p>
    </div>
  );
}

/**
 * Expanded overlay that shows detailed weather information
 * such as location, condition, temperature, feels like,
 * wind speed, and humidity levels.
 *
 * Closes when you click outside the panel.
 *
 */
function WeatherDetailOverlay({
  data,
  temperatureUnit,
  onClose,
}: {
  data: WeatherData;
  temperatureUnit: "Celsius" | "Fahrenheit";
  onClose: () => void;
}) {
  const temperature =
    temperatureUnit === "Celsius" ? data.current.temp_c : data.current.temp_f;

  const tempUnit = temperatureUnit === "Celsius" ? "°C" : "°F";
  const iconUrl = "https:" + data.current.condition.icon;

  return (
    <>
      <div className="weather-backdrop" onClick={onClose} />
      <div className="weather-detail-panel">
        {/* Boise */}
        <h3>{data.location.name}</h3>
        {/* Current condition icon */}
        <img src={iconUrl} alt={data.current.condition.text} />

        {/* Current condition and temperature */}
        <span>
          <p>{data.current.condition.text}</p>
          <p>
            {Math.round(temperature)}
            {tempUnit}
          </p>
        </span>
        <hr />

        {/* Feels like temperature */}
        <span>
          <strong>Feels like:</strong>
          <p>
            {Math.round(
              temperatureUnit === "Celsius"
                ? data.current.feelslike_c
                : data.current.feelslike_f,
            )}
            {tempUnit}
          </p>
        </span>

        {/* Wind speed in kph or mph to match degrees unit */}
        <span>
          <strong>Wind:</strong>
          <p>
            {temperatureUnit === "Celsius"
              ? `${data.current.wind_kph} kph`
              : `${data.current.wind_mph} mph`}
          </p>
        </span>

        {/* Humidity percentage */}
        <span>
          <strong>Humidity:</strong>
          <p>{data.current.humidity}%</p>
        </span>
      </div>
    </>
  );
}

// Loads weather data for the specified city, using cached data if available and valid.
// If no valid cached data exists, it fetches new data from the API, caches it, and returns it.
async function loadWeather(city: string): Promise<WeatherData> {
  const cached = getCachedWeather(city);
  if (cached) return cached;

  const data = await fetchWeatherData(city);
  cacheWeather(city, data);
  return data;
}

// Fetches weather data from the API for the specified city.
async function fetchWeatherData(city: string): Promise<WeatherData> {
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
  const response = await fetch(url);

  if (!response.ok)
    throw new Error(`Weather API request failed: ${response.status}`);

  return response.json();
}

// Check for cahed weather data in localStorage for the same city that is less than 10 minutes old.
// If valid cached data exists, return it. Otherwise, return null.
function getCachedWeather(city: string): WeatherData | null {
  try {
    const cached = localStorage.getItem("weatherCache");
    if (!cached) return null;

    const { city: cachedCity, data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION_MS;
    const isSameCity = cachedCity === city;

    if (isExpired || !isSameCity) return null;

    return data;
  } catch {
    return null;
  }
}

// Cache weather data in localStorage with the city name
// and a timestamp for expiration checking.
function cacheWeather(city: string, data: WeatherData): void {
  localStorage.setItem(
    "weatherCache",
    JSON.stringify({
      city,
      data,
      timestamp: Date.now(),
    }),
  );
}
