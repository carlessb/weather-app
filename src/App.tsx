// src/App.tsx (TypeScript version)
import React, { useState } from 'react'; // No useEffect needed for this basic example if fetch is only on submit
import axios, { AxiosError } from 'axios'; // Import AxiosError for better error typing
import './App.css'; // Assuming you have styles
import { WeatherData } from './types/weather'; // Import the interface

function App() {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Access the API key (Vite handles type inference for import.meta.env)
  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  const fetchWeather = async (searchCity: string): Promise<void> => { // Added return type Promise<void>
    if (!searchCity || !apiKey) {
        setError("API Key or City is missing."); // Basic check
        return;
    }
    setLoading(true);
    setError(null);
    setWeatherData(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=metric`;

    try {
      // Explicitly type the expected response data with Axios generics
      const response = await axios.get<WeatherData>(url);
      setWeatherData(response.data);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      const axiosError = err as AxiosError; // Type assertion for better error handling

      if (axiosError.response) {
         // The request was made and the server responded with a status code
         // that falls out of the range of 2xx
        if (axiosError.response.status === 404) {
          setError(`Could not find weather data for "${searchCity}". Please check spelling.`);
        } else if (axiosError.response.status === 401) {
           setError('Invalid API Key. Please check your configuration.');
        }
         else {
          setError(`Server Error: ${axiosError.response.status}. Please try again later.`);
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        setError('Network Error: Could not reach the weather service.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`An unexpected error occurred: ${axiosError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Type the form submission event
  const handleSearch = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    fetchWeather(city);
  };

  // Type the input change event
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
     setCity(event.target.value);
  };

  // Helper function to determine background/animation class based on weather condition
  const getWeatherClass = (): string => {
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) return 'weather-default';
    const main = weatherData.weather[0].main.toLowerCase();
    if (main.includes('clear')) {
      return 'weather-clear';
    } else if (main.includes('cloud')) {
      return 'weather-clouds';
    } else if (main.includes('rain')) {
      return 'weather-rain';
    } else if (main.includes('snow')) {
      return 'weather-snow';
    } else {
      return 'weather-default';
    }
  };

  return (
    <div className="App">
      <h1>The Weather</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange} // Use the typed handler
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Type safety: weatherData could be null */}
      {weatherData && (
        // Add dynamic class based on weather condition for background & animation
        <div className={`weather-display ${getWeatherClass()}`}>
          <h2>{weatherData.name}, {weatherData.sys?.country}</h2>
          <p>Temperature: {Math.round(weatherData.main.temp)}°C</p>
          <p>Feels Like: {Math.round(weatherData.main.feels_like)}°C</p>
          {weatherData.weather && weatherData.weather.length > 0 && (
            <>
              <p>Condition: {weatherData.weather[0].main} ({weatherData.weather[0].description})</p>
              <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                  title={weatherData.weather[0].description}
               />
            </>
          )}
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind?.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;