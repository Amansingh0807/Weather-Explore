import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    const fetchForecastData = async () => {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.shecodes.io/weather/v1/forecast?query=${data.city}&key=${apiKey}&units=metric`;

      try {
        const response = await axios.get(url);
        setForecastData(response.data.daily); // Set daily forecast data
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    if (data.city) fetchForecastData();
  }, [data.city]);

  const formatDay = (timestamp) => {
    const options = { weekday: "short" };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", options);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  const renderTemperature = (temperature) => {
    return isCelsius
      ? Math.round(temperature)
      : Math.round((temperature * 9) / 5 + 32);
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const currentDate = new Date().toLocaleDateString("en-US", options);
    return currentDate;
  };

  return (
    <div>
      <div className="city-name">
        <h2>
          {data.city}, <span>{data.country}</span>
        </h2>
      </div>
      <div className="date">
        <span>{getCurrentDate()}</span>
      </div>
      <div className="temp">
        {data.condition.icon_url && (
          <img
            src={data.condition.icon_url}
            alt={data.condition.description}
            className="temp-icon"
          />
        )}
        <p>
          {renderTemperature(data.temperature.current)}°
          <sup onClick={toggleTemperatureUnit} className="toggle-temp">
            {isCelsius ? "C" : "F"}
          </sup>
        </p>
      </div>
      <p className="weather-des">{data.condition.description}</p>
      <div className="weather-info">
        <div className="col">
          <ReactAnimatedWeather icon="WIND" size={40} />
          <div>
            <p className="wind">{data.wind.speed} m/s</p>
            <p>Wind Speed</p>
          </div>
        </div>
        <div className="col">
          <ReactAnimatedWeather icon="RAIN" size={40} />
          <div>
            <p className="humidity">{data.temperature.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
      </div>
      {forecastData.length > 0 && (
        <div className="forecast">
          {/* // Next five days of forecast */}
          <h3>Next 5-Day Forecast</h3>             
          <div className="forecast-list">
            {forecastData.slice(0, 5).map((day, index) => (
              <div key={index} className="forecast-item">
                <p>{formatDay(day.time)}</p>
                <img
                  src={day.condition.icon_url}
                  alt={day.condition.description || "No description"}
                />
                <p>{renderTemperature(day.temperature.day)}°</p>
                <p>Wind: {day.wind.speed} m/s</p>
                <p>Humidity: {day.temperature.humidity}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Forecast;
