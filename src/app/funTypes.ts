export interface Jeocode {
      zip: string;
      name:string;
      lat: number;
      lon:number;
      country:string;
}

export interface OneCallResponse {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  data: Daum[]
  prev: string
  next: string
}

export interface Daum {
  dt: number
  sunrise: number
  sunset: number
  moonrise: number
  moonset: number
  moon_phase: number
  temp: Temp
  feels_like: FeelsLike
  pressure: number
  humidity: number
  dew_point: number
  wind_speed: number
  wind_deg: number
  weather: WeatherB[]
  clouds: number
  pop: number
  uvi?: number
  rain?: number
}

export interface Temp {
  day: number
  min: number
  max: number
  night: number
  eve: number
  morn: number
}

export interface FeelsLike {
  day: number
  night: number
  eve: number
  morn: number
}

export interface WeatherB {
  id: number
  main: string
  description: string
  icon: string
}

export interface Lokation {
  jeocode:Jeocode;
  oneCallResponse:OneCallResponse;
  dt:number;
}

export interface SearchResponse {
  lokation: Lokation;
  lokationsCount:number;
  messageFromServer:string;
  success:boolean;
}