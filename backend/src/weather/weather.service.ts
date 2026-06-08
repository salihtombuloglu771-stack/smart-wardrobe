import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  rain: boolean;
  snow: boolean;
  city: string;
  icon: string;
}

@Injectable()
export class WeatherService {
  constructor(private config: ConfigService) {}

  async getWeather(city: string): Promise<WeatherData> {
    const apiKey = this.config.get('OPENWEATHER_API_KEY');
    if (!apiKey) throw new BadRequestException('Hava durumu API anahtarı eksik');

    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: { q: city, appid: apiKey, units: 'metric', lang: 'tr' },
        },
      );

      return {
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind.speed * 3.6),
        description: data.weather[0].description,
        rain: data.weather[0].main === 'Rain' || data.weather[0].main === 'Drizzle',
        snow: data.weather[0].main === 'Snow',
        city: data.name,
        icon: data.weather[0].icon,
      };
    } catch {
      throw new BadRequestException('Hava durumu alınamadı. Şehir adını kontrol edin.');
    }
  }
}
