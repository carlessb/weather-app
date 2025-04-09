// src/types/weather.ts

export interface WeatherMain {
    temp: number;
    feels_like: number;
    temp_min: number; // Example of adding more fields if needed
    temp_max: number; // Example
    pressure: number;
    humidity: number;
  }
  
  export interface WeatherCondition {
    id: number;
    main: string; // e.g., "Clouds", "Rain"
    description: string;
    icon: string; // e.g., "04d"
  }
  
  export interface WeatherWind {
    speed: number;
    deg: number; // Wind direction
  }
  
  export interface WeatherSys {
      type: number;
      id: number;
      country: string; // e.g., "GB"
      sunrise: number; // Timestamp
      sunset: number; // Timestamp
  }
  
  // The main structure of the API response
  export interface WeatherData {
    coord: { lon: number; lat: number };
    weather: WeatherCondition[]; // It's an array, usually with one item
    base: string;
    main: WeatherMain;
    visibility: number;
    wind: WeatherWind;
    clouds: { all: number };
    dt: number; // Timestamp of data calculation
    sys: WeatherSys;
    timezone: number;
    id: number; // City ID
    name: string; // City name
    cod: number; // Internal parameter
  }