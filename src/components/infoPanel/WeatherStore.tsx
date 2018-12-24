import * as openweather from 'openweather-apis';
import * as darksky from 'dark-sky-api';

import { ILatLon } from './../../utils/types';

export interface IWeatherStore {
    position: ILatLon,
    darksky?: Partial<IWeather>,
    openweather?: IWeather,
    forecast?: Partial<IWeather>[],
}

export interface IWind {
    speed: number;
    direction: number;
    gust?: number;
    bearing?: string;
}

export interface IWeather {
    position: ILatLon;
    wind: IWind;
    sunrise: number;
    sunset: number;
    temperature: number;
    precipProbability?: number;
    summary?: string;
    icon?: string;
    maxTemp?: number;
    minTemp?: number;
    time?: number;
}

export interface IOpenWeather {
    coord: ILatLon,
    wind: IWind,
    main: {
        temp: number
    };
    sys: {
        sunrise: number;
        sunset: number;
    };
}

export interface IDarkSkyWeather {
    coord: ILatLon,
    temperature: number;
    windSpeed: number;
    windBearing: number;
    windDirection: string;
    windGust: number;
    icon: string;
    precipProbability: number;
    time: string;
    summary: string;
}

export interface IDarkSkyForecast {
    temperatureMax: number;
    temperatureMin: number;
    windSpeed: number;
    windBearing: number;
    windDirection: string;
    icon: string;
    precipProbability: number;
    time: number;
}

export interface IDarkSkyForecastList {
    daily: {
        data: IDarkSkyForecast[];
    };
}

export class WeatherStore {
    weatherLocations: {[key: number]: IWeatherStore} = {};

    openWeatherConverter(input: IOpenWeather) {
        let output: IWeather = {
            position: {
                lat: input.coord.lat,
                lon: input.coord.lon
            },
            wind: {
                speed: input.wind.speed,
                direction: input.wind.direction,
            },
            temperature: input.main.temp,
            sunrise: input.sys.sunrise,
            sunset: input.sys.sunset,
        }
        
        return output;
    }

    darkskyWeatherConverter(input: IDarkSkyWeather): Partial<IWeather> {
        let output: Partial<IWeather> = {
            wind: {
                speed: input.windSpeed,
                direction: input.windBearing,
                gust: input.windGust,
                bearing: input.windDirection,
            },
            temperature: input.temperature,
            precipProbability: input.precipProbability,
            summary: input.summary,
            icon: input.icon,
        }
        return output;
    }

    darkskyForecastConverter(input: IDarkSkyForecast): Partial<IWeather> {
        let output: Partial<IWeather> = {
            wind: {
                speed: input.windSpeed,
                direction: input.windBearing,
                bearing: input.windDirection,
            },
            maxTemp: input.temperatureMax,
            minTemp: input.temperatureMin,
            precipProbability: input.precipProbability,
            time: input.time,
            icon: input.icon,
        }
        return output;
    }

    createForecast(input: IDarkSkyForecastList): Partial<IWeather>[] {
        // we want forecast for today, tomorrow, and the next day
        let data = input.daily.data;
        let forecast: Partial<IWeather>[] = [];
        for (let day of data) {
            forecast.push(this.darkskyForecastConverter(day));
        }
        return forecast;
    }

    makeKey(lat: number, lon: number) {
        return lat + lon;
    }

    getWeatherAtLocation(lat: number, lon: number): Promise<IWeatherStore> {
        let __this = this;

        if (this.weatherLocations[this.makeKey(lat, lon)]) {
            return new Promise((resolve) => {resolve(__this.weatherLocations[__this.makeKey(lat,lon)])});
        }

        openweather.setCoordinate(lat, lon);
        return new Promise((resolve) => {
            openweather.getAllWeather(function(err: any, JSONObj: IOpenWeather){
                __this.weatherLocations[__this.makeKey(lat,lon)] = {
                    position: {
                        lat: lat,
                        lon: lon,
                    },
                    openweather: __this.openWeatherConverter(JSONObj)
                };
                const position: {latitude: number, longitude: number} = {
                    latitude: lat, 
                    longitude: lon
                  };

                darksky.loadCurrent(position).then(function(result: IDarkSkyWeather) {
                    __this.weatherLocations[__this.makeKey(lat,lon)].darksky 
                        = __this.darkskyWeatherConverter(result);
                        darksky.loadForecast(position)
                        .then(function(result: IDarkSkyForecastList) {
                        __this.weatherLocations[__this.makeKey(lat,lon)].forecast = __this.createForecast(result);
                        resolve(__this.weatherLocations[__this.makeKey(lat,lon)]);
                    })
                    });
        })});
    }
}
