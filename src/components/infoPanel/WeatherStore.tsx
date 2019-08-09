import * as darksky from "dark-sky-api";
// import * as openweather from "openweather-apis";

import { ILatLon } from "./../../utils/types";

export interface IWeatherStore {
    position: ILatLon;
    darksky?: Partial<IWeather>;
    openweather?: IWeather;
    forecast?: Array<Partial<IWeather>>;
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
    coord: ILatLon;
    wind: IWind;
    main: {
        temp: number,
    };
    sys: {
        sunrise: number;
        sunset: number;
    };
}

export interface IDarkSkyWeather {
    coord: ILatLon;
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
    public weatherLocations: {[key: number]: IWeatherStore} = {};

    public openWeatherConverter(input: IOpenWeather): IWeather {
        const output: IWeather = {
            position: {
                lat: input.coord.lat,
                lon: input.coord.lon,
            },
            wind: {
                speed: input.wind.speed * 3.6,
                direction: input.wind.direction,
            },
            temperature: input.main.temp,
            sunrise: input.sys.sunrise,
            sunset: input.sys.sunset,
        };
        return output;
    }

    public darkskyWeatherConverter(input: IDarkSkyWeather): Partial<IWeather> {
        const output: Partial<IWeather> = {
            wind: {
                speed: input.windSpeed * 3.6,
                direction: input.windBearing,
                gust: input.windGust,
                bearing: input.windDirection,
            },
            temperature: input.temperature,
            precipProbability: input.precipProbability,
            summary: input.summary,
            icon: input.icon,
        };
        return output;
    }

    public darkskyForecastConverter(input: IDarkSkyForecast): Partial<IWeather> {
        const output: Partial<IWeather> = {
            wind: {
                speed: input.windSpeed * 3.6,
                direction: input.windBearing,
                bearing: input.windDirection,
            },
            maxTemp: input.temperatureMax,
            minTemp: input.temperatureMin,
            precipProbability: input.precipProbability,
            time: input.time,
            icon: input.icon,
        };
        return output;
    }

    public createForecast(input: IDarkSkyForecastList): Array<Partial<IWeather>> {
        // we want forecast for today, tomorrow, and the next day
        const data: IDarkSkyForecast[] = input.daily.data;
        const forecast: Array<Partial<IWeather>> = [];
        for (const day of data) {
            forecast.push(this.darkskyForecastConverter(day));
        }
        return forecast;
    }

    public makeKey(lat: number, lon: number): number {
        return lat + lon * 100;
    }

    public getWeatherAtLocation(lat: number, lon: number): Promise<IWeatherStore> {
        const localState: WeatherStore = this;

        if (this.weatherLocations[this.makeKey(lat, lon)]) {
            return new Promise<IWeatherStore>((resolve: any): void => {
                resolve(localState.weatherLocations[localState.makeKey(lat, lon)]);
            });
        }

        // openweather.setCoordinate(lat, lon);
        return new Promise((resolve: any): void => {
                const position: {latitude: number, longitude: number} = {
                    latitude: lat,
                    longitude: lon,
                  };

                darksky.loadCurrent(position).then((result: IDarkSkyWeather) => {
                    localState.weatherLocations[localState.makeKey(lat, lon)] = {
                        position: {
                            lat,
                            lon,
                        },
                        darksky: localState.darkskyWeatherConverter(result),
                    };
                    darksky.loadForecast(position)
                        .then((result: IDarkSkyForecastList) => {
                            localState.weatherLocations[localState.makeKey(lat, lon)].forecast =
                                localState.createForecast(result);
                            resolve(localState.weatherLocations[localState.makeKey(lat, lon)]);
                    });
                });
            });
    }
}
