import moment from "moment";
import React from "react";
import cloudy from "../../img/cloudy.svg";
import fog from "../../img/fog.svg";
import partlyCloudy from "../../img/partlyCloudy.svg";
import rain from "../../img/rain.svg";
import sleet from "../../img/sleet.svg";
import snow from "../../img/snow.svg";
import sun from "../../img/sun.svg";
import wind from "../../img/wind.svg";
import { IWeather, IWeatherStore, WeatherStore } from "./WeatherStore";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const WEATHER_ICONS = [
    {icon: "cloudy", element: <img src={cloudy} alt="" className="weather-icon"/>},
    {icon: "clear-day", element: <img src={sun} alt="" className="weather-icon"/>},
    {icon: "clear-night", element: <img src={sun} alt="" className="weather-icon"/>},
    {icon: "rain", element: <img src={rain} alt="" className="weather-icon"/>},
    {icon: "snow", element: <img src={snow} alt="" className="weather-icon"/>},
    {icon: "sleet", element: <img src={sleet} alt="" className="weather-icon"/>},
    {icon: "wind", element: <img src={wind} alt="" className="weather-icon"/>},
    {icon: "fog", element: <img src={fog} alt="" className="weather-icon"/>},
    {icon: "partly-cloudy-day", element: <img src={partlyCloudy} alt="" className="weather-icon"/>},
    {icon: "partly-cloudy-night", element: <img src={partlyCloudy} alt="" className="weather-icon"/>},
];

interface IWeatherForecastState {
    weatherStore: any;
    weatherProvider: string;
    weather: IWeatherStore | null;
    lat: number;
    lon: number;
}

interface IWeatherForecastProps {
    weatherStore: WeatherStore;
    lat: number;
    lon: number;
}

export class WeatherForecast extends React.Component<IWeatherForecastProps, IWeatherForecastState> {
    constructor(props: IWeatherForecastProps) {
        super(props);
        this.state = ({
            weatherStore: props.weatherStore,
            weatherProvider: "DarkSky",
            lat: 0,
            lon: 0,
            weather: null,
        });
    }

    public componentDidMount() {
      this._loadUserData();
    }

    public componentDidUpdate(prevProps: IWeatherForecastProps) {
        if (this.props.lat !== prevProps.lat) {
            this.setState({weather: null, lat: this.props.lat});
            this._loadUserData();
        }
    }

    public alternateProvider() {
        if (this.state.weatherProvider === "OpenWeather") {
            this.setState({weatherProvider: "DarkSky"});
        } else if (this.state.weatherProvider === "DarkSky") {
            this.setState({weatherProvider: "OpenWeather"});
        }
    }

    public getWeatherObject(): Partial<IWeather> | null {
        if (this.state.weather && this.state.weatherProvider === "OpenWeather") {
            return this.state.weather.openweather || null;
        } else if (this.state.weather && this.state.weatherProvider === "DarkSky") {
            return this.state.weather.darksky || null;
        } else {
            return null;
        }
    }

    public getForecastDay(day: number): Partial<IWeather> | null {
        if (this.state.weather && this.state.weather.forecast) {
            return this.state.weather.forecast[day] || null;
        } else {
            return null;
        }
    }

    public getForecastMaxTemp = (day: number): JSX.Element | null => {
        const forecast: Partial<IWeather> | null = this.getForecastDay(day);
        if (forecast && forecast.maxTemp) {
            const temp = Math.round(forecast.maxTemp * 10) / 10;
            return (
                <div className="weather-temp">
                    <span>
                        {temp} <span>&deg;C</span>
                    </span>
                    <span className="temp-text">High</span>
                </div>
            );
        } else {
            return null;
        }
    }

    public getForecastMinTemp = (day: number): JSX.Element | null => {
        const forecast: Partial<IWeather> | null = this.getForecastDay(day);
        if (forecast && forecast.minTemp) {
            const temp = Math.round(forecast.minTemp * 10) / 10;
            return (
                <div className="weather-temp">
                    <span>
                        {temp} <span>&deg;C</span>
                    </span>
                    <span className="temp-text">Low</span>
                </div>
            );
        } else {
            return null;
        }
    }

    public getForecastWindSpeed = (day: number): JSX.Element | null => {
        const forecast: Partial<IWeather> | null = this.getForecastDay(day);
        if (forecast && forecast.wind) {
            const wind = Math.round(forecast.wind.speed * 10) / 10;
            return (
                <span className="wind-speed">
                    {wind + " km/h"}
                </span>
            );
        } else {
            return null;
        }
    }

    public getForecastWindDirection = (day: number): JSX.Element | null => {
        const forecast: Partial<IWeather> | null = this.getForecastDay(day);
        if (forecast && forecast.wind) {
            return (
                <div className="weather-wind-direction">
                    <span className="wind-text">Wind</span>
                    <span className="wind-direction">
                        {forecast.wind.direction}
                    </span>
                    <span className="wind-text">Direction</span>
                </div>);
        } else {
            return null;
        }
    }

    public getForecastIcon(day: number): JSX.Element | null {
        const forecast: Partial<IWeather> | null = this.getForecastDay(day);
        if (forecast && forecast.icon) {
            const icon = forecast.icon;
            for (const weatherIcon of WEATHER_ICONS) {
                if (icon === weatherIcon.icon) {
                    return (
                        <div className="icon-summary">
                            {weatherIcon.element}
                            <span className="summary-text">
                                {forecast.summary}
                            </span>
                        </div>
                    );
                }
            }
            return (
                <div className="icon-summary">
                 <img src={cloudy} alt="" className="weather-icon"/>
                <span className="summary-text">
                    {forecast.summary}
                </span>
                </div>
            );
        } else {
            return null;
        }
    }

    public getDayOfWeek(dayNumber: number): string {
        return (function(value) {
            switch (value) {
            case 0:
            return "Sunday";
            case 1:
            return "Monday";
            case 2:
            return "Tuesday";
            case 3:
            return "Wednesday";
            case 4:
            return "Thursday";
            case 5:
            return "Friday";
            case 6:
            return "Saturday";
            default:
            return "";
        }})(dayNumber);
    }

    public getForecastTime(day: number): JSX.Element | null {
        const forecast: Partial<IWeather> | null = this.getForecastDay(day);
        if (forecast && forecast.time) {
            const forecastTime = moment.unix(forecast.time);
            const currentTime = moment();
            const __this = this;
            const difference = moment.duration(forecastTime.diff(currentTime)).asHours();
            const title = (function(value, forecastTime) {
                switch (true) {
                case value < 0:
                    return "Today";
                case value < 24 && value > 0:
                    return "Tomorrow";
                case value > 24:
                    return __this.getDayOfWeek(forecastTime.day());
                default:
                    return "";
            }})(difference, forecastTime);
            return (<div className="weather-day">{title}</div>);
        } else {
            return null;
        }
    }

    public getForecastElement(day: number): JSX.Element {
        return (
            <Card>
                <CardContent className="forecast-element">
                {this.getForecastIcon(day)}
                {this.getForecastTime(day)}
                {this.getForecastMaxTemp(day)}
                {this.getForecastMinTemp(day)}
                {this.getForecastWindSpeed(day)}
                {this.getForecastWindDirection(day)}
                </CardContent>
            </Card>
        );
    }

    public render(): JSX.Element {
        return (
            <Card style={{width: "50%"}}>
                <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    Forecast
                </Typography>
                    <div className="weather-data">
                        {this.state.weather && this.getForecastElement(0)}
                        {this.state.weather && this.getForecastElement(1)}
                        {this.state.weather && this.getForecastElement(2)}
                    </div>
                </CardContent>
            </Card>
        );
    }

    public _loadUserData() {
        const __this = this;
        this.props.weatherStore.getWeatherAtLocation(this.props.lat, this.props.lon).then(
            function(result: IWeatherStore) {
                __this.setState({
                    weather: result,
                    lat: __this.props.lat,
                });
            },
        );
    }
  }
