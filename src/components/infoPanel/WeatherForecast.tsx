import moment, { Moment } from "moment";
import React from "react";
import cloudy from "../../img/cloudy.svg";
import fog from "../../img/fog.svg";
import partlyCloudy from "../../img/partlyCloudy.svg";
import rain from "../../img/rain.svg";
import sleet from "../../img/sleet.svg";
import snow from "../../img/snow.svg";
import sun from "../../img/sun.svg";
import sunrise from "../../img/sunrise.svg";
import sunset from "../../img/sunset.svg";
import wind from "../../img/wind.svg";
import { IWeather, IWeatherStore, WeatherStore } from "./WeatherStore";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { CurrentWeather } from "./CurrentWeather";

interface IWindDir {
    abbrv: string;
    translation: string;
    bearing: number;
}

const WIND_DIRECTIONS: IWindDir[] = [
    {abbrv: "SW", translation: "South Westerlies", bearing: 225},
    {abbrv: "NW", translation: "North Westerlies", bearing: 315},
    {abbrv: "S", translation: "Southerlies", bearing: 180},
    {abbrv: "N", translation: "Northerlies", bearing: 0},
    {abbrv: "E", translation: "Easterlies", bearing: 90},
    {abbrv: "W", translation: "Westerlies", bearing: 270},
    {abbrv: "NE", translation: "North Easterlies", bearing: 45},
    {abbrv: "SE", translation: "South Easterlies", bearing: 135},
];

const WEATHER_ICONS: Array<{icon: string; element: JSX.Element}> = [
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

interface ISunTimes {
    sunrise: string;
    sunset: string;
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

    public componentDidMount(): void {
      this._loadUserData();
    }

    public componentDidUpdate(prevProps: IWeatherForecastProps): void {
        if (this.props.lat !== prevProps.lat) {
            this.setState({weather: null, lat: this.props.lat});
            this._loadUserData();
        }
    }

    public alternateProvider(): void {
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
            const temp: number = Math.round(forecast.maxTemp * 10) / 10;
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
            const temp: number = Math.round(forecast.minTemp * 10) / 10;
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
            const wind: number = Math.round(forecast.wind.speed * 10) / 10;
            return (
                <span className="wind-speed">
                    {wind + " km/h"}
                </span>
            );
        } else {
            return null;
        }
    }

    public computeHeadingDiff = (x: number, y: number): number => {
        return Math.abs((x - y + 540 ) % 360 - 180);
    }

    public convertWindDirection = (bearing: number): string => {
        const bearingDiff: Array<{name: string; diff: number}> = WIND_DIRECTIONS.map((item: IWindDir) => ({
            name: item.abbrv,
            diff: this.computeHeadingDiff(item.bearing, bearing),
        }));
        const diffs: number[] = bearingDiff.map((item: {name: string; diff: number}) => item.diff);
        const minDiff: number = Math.min(...diffs);
        const minValue: Array<{name: string; diff: number}> = bearingDiff.filter(
            (item: {name: string; diff: number}) => item.diff === minDiff,
        );
        if (minValue.length > 0) {
            return minValue[0].name;
        }
        return "";
    }

    public getForecastWindDirection = (day: number): JSX.Element | null => {
        const forecast: Partial<IWeather> | null = this.getForecastDay(day);
        if (forecast && forecast.wind) {
            return (
                <div className="weather-wind-direction">
                    <span className="wind-text">Wind</span>
                    <span className="wind-direction">
                        {this.convertWindDirection(forecast.wind.direction)}
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
            const icon: string = forecast.icon;
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
        return ((value: number): string => {
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
            const forecastTime: moment.Moment = moment.unix(forecast.time);
            const currentTime: moment.Moment = moment();
            const localState: WeatherForecast = this;
            const difference: number = moment.duration(forecastTime.diff(currentTime)).asHours();
            const title: string = ((value: number, forecastTime: moment.Moment): string => {
                switch (true) {
                case value < 0:
                    return "Today";
                case value < 24 && value > 0:
                    return "Tomorrow";
                case value > 24:
                    return localState.getDayOfWeek(forecastTime.day());
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
            <div className="forecast-element">
                {this.getForecastIcon(day)}
                {this.getForecastTime(day)}
                {this.getForecastMaxTemp(day)}
                {this.getForecastMinTemp(day)}
                {this.getForecastWindSpeed(day)}
                {this.getForecastWindDirection(day)}
            </div>
        );
    }

    public getSunRiseAndSet(): ISunTimes {
        if (this.state.weather && this.state.weather.openweather) {
            const sunrise: moment.Moment = moment.unix(this.state.weather.openweather.sunrise);
            const sunset: moment.Moment = moment.unix(this.state.weather.openweather.sunset);
            return {
                sunrise: sunrise.format("h:mm a"),
                sunset: sunset.format("h:mm a")};
        } else {
            return {
                sunrise: "",
                sunset: "",
            };
        }
    }

    public getDetails = (): JSX.Element => {
        const sunRiseAndSet: ISunTimes = this.getSunRiseAndSet();
        return (
            <div className="weather-details" style = {{right: 0}}>
                <div className="sun-time">
                    <img src={sunrise} alt="" className="sunrise-icon"/>
                    {"Sunrise: " + sunRiseAndSet.sunrise}
                </div>
                <div className="sun-time">
                    <img src={sunset} alt="" className="sunrise-icon"/>
                    {" Sunset: " + sunRiseAndSet.sunset}
                </div>
                    {/* <button
                    className='weather-credit-button'
                    onClick={() => {this.alternateProvider()}}
                    >{this.state.weatherProvider}</button> */}
            </div>
        );
    }

    public render(): JSX.Element {
        return (
            <div>
                <Typography variant="h5" style={{margin: "15px"}}>
                    {"Current"}
                </Typography>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                    <CurrentWeather
                        lat={this.props.lat || 0}
                        lon={this.props.lon || 0}
                        weatherStore={this.props.weatherStore}
                        textColor = {"black"}
                    />
                    {this.getDetails()}
                </div>
                <Typography variant="h5" style={{margin: "15px"}}>
                    {"Forecast"}
                </Typography>
                <div className="weather-data" style = {{justifyContent: "center"}}>
                    {this.state.weather && this.getForecastElement(0)}
                    {this.state.weather && this.getForecastElement(1)}
                    {this.state.weather && this.getForecastElement(2)}
                </div>
            </div>
        );
    }

    public _loadUserData(): void {
        const localState: WeatherForecast = this;
        this.props.weatherStore.getWeatherAtLocation(this.props.lat, this.props.lon).then(
            (result: IWeatherStore) => {
                localState.setState({
                    weather: result,
                    lat: localState.props.lat,
                });
            },
        );
    }
  }
