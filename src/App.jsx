import { useEffect, useState } from "react";
import "./index.css";
const KEY = "c1d894caccf643c89d3114336253003";
function App() {
  const [city, setCity] = useState(" ");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorCity, setErrorCity] = useState(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      (err) => {
        console.error("Errors", err.message);
        setErrorCity("Failed to get your location");
      }
    );
  }, []);

  useEffect(() => {
    if (!city.trim() && !coords) {
      setErrorCity(null);
      return;
    }
    async function getData() {
      setLoading(true);
      try {
        const query = city.trim()
          ? city
          : `${coords.latitude} ${coords.longitude}`;

        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${query}`
        );
        const data = await response.json();
        if (data.error) {
          setErrorCity(data.error.message);
          setWeatherData(null);
          return;
        }
        setErrorCity(null);
        setWeatherData(data);
      } catch (error) {
        console.log(error.message);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [city, coords]);

  return (
    <div className="app">
      <div className="widget-container">
        <div className="weather-card-container">
          <h1 className="app-title">Weather Widget</h1>
          <div className="search-container">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              placeholder="Enter city name"
              className="search-input"
            />
          </div>
        </div>
        {loading ? (
          "loading..."
        ) : errorCity ? (
          <p>{"Please enter your city"}</p>
        ) : (
          weatherData && (
            <div className="weather-card">
              <h2>{` ${weatherData?.location?.name}, ${weatherData?.location?.country}`}</h2>
              <img
                src={weatherData?.current?.condition?.icon}
                alt="icon"
                className="weather-icon"
              />
              <p className="temperature">
                {Math.round(weatherData?.current?.temp_c)}
              </p>
              <p className="condition">
                {weatherData?.current?.condition?.text}
              </p>
              <div className="weather-details">
                <p>{`Humidity:${weatherData?.current?.humidity}%`}</p>
                <p>{`Wind: ${weatherData?.current?.wind_kph} km/h`}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
