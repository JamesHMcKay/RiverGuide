import { Hidden } from "@material-ui/core";
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

interface ICurrentWeatherState {
    weatherStore: any;
    weatherProvider: string;
    weather: IWeatherStore | null;
    lat: number;
    lon: number;
}

interface ICurrentWeatherProps {
    weatherStore: WeatherStore;
    lat: number;
    lon: number;
    onClick?: () => void;
    textColor: string;
    iconHeight: string;
    tempSize: string;
}

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

export class CurrentWeather extends React.Component<ICurrentWeatherProps, ICurrentWeatherState> {
    constructor(props: ICurrentWeatherProps) {
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

    public componentDidUpdate(prevProps: ICurrentWeatherProps): void {
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

    public getCurrentTemp = (): JSX.Element => {
        let temp: number | null = null;
        const weather: Partial<IWeather> | null = this.getWeatherObject();
        if (weather && weather.temperature) {
            temp = Math.round(weather.temperature * 10) / 10;
        }
        return (
            <div className="current-weather-temp">
                <span className="current-temp" style={{fontSize: this.props.tempSize}}>
                    {temp} <span>&deg;C</span>
                </span>
                <Hidden smDown>
                    <span className="summary-text">
                        {weather && weather.summary}
                    </span>
                </Hidden>
            </div>
        );
    }

    public getIcon(): JSX.Element | null {
        const weather: Partial<IWeather> | null = this.getWeatherObject();
        if (weather && weather.icon) {
            const icon: string = weather.icon;
            for (const weatherIcon of WEATHER_ICONS) {
                if (icon === weatherIcon.icon) {
                    return (
                        <div className="icon-summary" style={{height: this.props.iconHeight}}>
                            {weatherIcon.element}
                        </div>
                    );
                }
            }
        }
        return null;
    }

    public getCurrentWeather(): JSX.Element {
        return (
            <div className="weather-element">
                {this.getIcon()}
                {this.getCurrentTemp()}
            </div>
        );
    }

    public getCursor(): string {
        if (this.props.onClick) {
            return "pointer";
        }
        return "auto";
    }

    public render(): JSX.Element {
        return (
            <div onClick = {this.props.onClick} style={{cursor: this.getCursor(), color: this.props.textColor}}>
                {this.state.weather && this.getCurrentWeather()}
            </div>
        );

    }
    public _loadUserData(): void {
        const localState: CurrentWeather = this;
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
