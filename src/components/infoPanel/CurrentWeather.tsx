import React from "react";
import moment from "moment";
import cloudy from "../../img/cloudy.svg";
import fog from "../../img/fog.svg";
import rain from "../../img/rain.svg";
import sleet from "../../img/sleet.svg";
import snow from "../../img/snow.svg";
import wind from "../../img/wind.svg";
import sunrise from "../../img/sunrise.svg";
import sunset from "../../img/sunset.svg";
import sun from "../../img/sun.svg";
import partlyCloudy from "../../img/partlyCloudy.svg";
import { IWeather, IWeatherStore, WeatherStore } from "./WeatherStore";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const CALM_WIND_THRESHOLD = 2;

const WIND_DIRECTIONS = [
    {abbrv: 'SW', translation: 'South Westerlies'},
    {abbrv: 'NW', translation: 'North Westerlies'},
    {abbrv: 'S', translation: 'Southerlies'},
    {abbrv: 'N', translation: 'Northerlies'},
    {abbrv: 'E', translation: 'Easterlies'},
    {abbrv: 'W', translation: 'Westerlies'},
    {abbrv: 'NE', translation: 'North Easterlies'},
    {abbrv: 'SE', translation: 'South Easterlies'},
];

const WEATHER_ICONS = [
    {icon: 'cloudy', element: <img src={cloudy} alt="" className="current-weather-icon"/>},
    {icon: 'clear-day', element: <img src={sun} alt="" className="current-weather-icon"/>},
    {icon: 'clear-night',element: <img src={sun} alt="" className="current-weather-icon"/>},
    {icon: 'rain', element: <img src={rain} alt="" className="current-weather-icon"/>},
    {icon: 'snow', element: <img src={snow} alt="" className="current-weather-icon"/>},
    {icon: 'sleet', element: <img src={sleet} alt="" className="current-weather-icon"/>},
    {icon: 'wind', element: <img src={wind} alt="" className="current-weather-icon"/>},
    {icon: 'fog', element: <img src={fog} alt="" className="current-weather-icon"/>},
    {icon: 'partly-cloudy-day', element: <img src={partlyCloudy} alt="" className="current-weather-icon"/>},
    {icon: 'partly-cloudy-night', element: <img src={partlyCloudy} alt="" className="current-weather-icon"/>},
];

interface ICurrentWeatherState {
    weatherStore: any
    weatherProvider: string;
    weather: IWeatherStore | null;
    lat: number;
    lon: number;
}

interface ICurrentWeatherProps {
    weatherStore: WeatherStore;
    lat: number;
    lon: number;
}

interface ISunTimes {
    sunrise: string;
    sunset: string;
}

export class CurrentWeather extends React.Component<ICurrentWeatherProps, ICurrentWeatherState> {
    constructor(props: ICurrentWeatherProps) {
        super(props);
        this.state = ({
            weatherStore: props.weatherStore,
            weatherProvider: 'DarkSky',
            lat: 0,
            lon: 0,
            weather: null,
        });
    }
  
    componentDidMount() {
      this._loadUserData();
    }
  
    componentDidUpdate(prevProps: ICurrentWeatherProps) {
        if (this.props.lat !== prevProps.lat) {
            this.setState({weather: null, lat: this.props.lat});
            this._loadUserData();
        }
    }

    alternateProvider() {
        if (this.state.weatherProvider === "OpenWeather") {
            this.setState({weatherProvider: "DarkSky"});
        } else if (this.state.weatherProvider === "DarkSky") {
            this.setState({weatherProvider: "OpenWeather"});
        }
    }

    getWeatherObject (): Partial<IWeather> | null {
        if (this.state.weather && this.state.weatherProvider === "OpenWeather") {
            return this.state.weather.openweather || null;
        } else if (this.state.weather && this.state.weatherProvider === "DarkSky") {
            return this.state.weather.darksky || null;
        } else {
            return null;
        }
    }

    getSunRiseAndSet (): ISunTimes {
        if (this.state.weather && this.state.weather.openweather) {
            let sunrise = moment.unix(this.state.weather.openweather.sunrise);
            let sunset = moment.unix(this.state.weather.openweather.sunset);
            return {
                sunrise: sunrise.format("h:mm a"),
                sunset: sunset.format("h:mm a")};
        } else {
            return {
                sunrise: '',
                sunset: ''
            };
        }

    }

    getDetails = (): JSX.Element => {
        let sunRiseAndSet = this.getSunRiseAndSet();
        return (
            <div className='weather-details'>
                <div className="sun-time">
                    <img src={sunrise} alt="" className="sunrise-icon"/>
                    {'Sunrise: ' + sunRiseAndSet.sunrise}
                </div>
                <div className="sun-time">
                    <img src={sunset} alt="" className="sunrise-icon"/>
                    {' Sunset: ' + sunRiseAndSet.sunset}
                </div>
                    {/* <button
                    className='weather-credit-button'
                    onClick={() => {this.alternateProvider()}}
                    >{this.state.weatherProvider}</button> */}
            </div>
        );
    }

    getCurrentTemp = (): JSX.Element => {
        let temp: number | null = null;
        const weather : Partial<IWeather> | null = this.getWeatherObject();
        if (weather && weather.temperature) {
            temp = Math.round(weather.temperature * 10) / 10;
        }
        return (
            <div className='current-weather-temp'>
                <span className='current-temp'>
                    {temp} <span>&deg;C</span>
                </span>
                <span className='summary-text'>
                    {weather && weather.summary}
                </span>
            </div>
        );
    }


    getWindText = (): string => {
        const weather : Partial<IWeather> | null = this.getWeatherObject();
        let speed: number = 0;
        let currentDirection: string | null = '';
        if (weather && weather.wind && weather.wind.bearing) {
            speed = weather.wind.speed;
            currentDirection = weather.wind.bearing;
        }
        
        if (speed < CALM_WIND_THRESHOLD) {
            return 'Calm';
        }
        
        for (let windText of WIND_DIRECTIONS) {
            if (currentDirection === windText.abbrv) {
                return windText.translation;
            }
        }
        return '';
    }


    getCurrentWind = () => {
        const weather : Partial<IWeather> | null = this.getWeatherObject();
        let speed: number = 0;
        if (weather && weather.wind) {
            speed = weather.wind.speed;
        }
        return (
            <div className='current-wind-details'>
                <div className='current-wind-text'>
                {this.getWindText()}
                </div>
                <span className='wind-text'>{speed + ' km/h'}</span>
            </div>
        );
    }

    getWindDirection = () => {
        const weather : Partial<IWeather> | null = this.getWeatherObject();
        let direction: number = 0;
        if (weather && weather.wind) {
            direction = weather.wind.direction;
        }
        return (
            <span className='wind-direction'>
                 {direction} <span>&deg;</span>
            </span>
        );
    }

    getIcon() {
        const weather : Partial<IWeather> | null = this.getWeatherObject();
        if (weather && weather.icon) {
            let icon = weather.icon;
            for (let weatherIcon of WEATHER_ICONS) {
                if (icon === weatherIcon.icon) {
                    return (
                        <div className='icon-summary'>
                            {weatherIcon.element}
                        </div>
                    );
                }
            }
        } else {
            return null;
        }
    }
  
    getCurrentWeather() {
        return (
            <div className='weather-element'>
                {this.getIcon()}
                {this.getCurrentTemp()}
                {this.getCurrentWind()}
                {this.getDetails()}
            </div>
        )
    }

    render() {
        return (
            <Card className="current-weather-card">
            <CardContent>
                {this.state.weather && this.getCurrentWeather()}
            </CardContent>
            </Card>
        )

    }
    _loadUserData() {
        let __this = this;
        this.props.weatherStore.getWeatherAtLocation(this.props.lat, this.props.lon).then(
            function(result: IWeatherStore) {
                __this.setState({
                    weather: result,
                    lat: __this.props.lat
                });
            }
        );
    }
  }