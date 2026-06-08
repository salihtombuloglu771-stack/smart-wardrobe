import { Injectable, BadRequestException } from '@nestjs/common';
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

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'açık', 1: 'çoğunlukla açık', 2: 'parçalı bulutlu', 3: 'bulutlu',
  45: 'sisli', 48: 'kırağılı sis',
  51: 'hafif çiseleyen', 53: 'çiseleyen', 55: 'yoğun çiseleyen',
  61: 'hafif yağmurlu', 63: 'yağmurlu', 65: 'şiddetli yağmurlu',
  71: 'hafif karlı', 73: 'karlı', 75: 'yoğun karlı',
  80: 'sağanak yağışlı', 81: 'şiddetli sağanak', 82: 'çok şiddetli sağanak',
  95: 'fırtınalı', 96: 'dolu fırtına', 99: 'şiddetli dolu fırtına',
};

const WMO_ICONS: Record<number, string> = {
  0: '01d', 1: '02d', 2: '03d', 3: '04d',
  45: '50d', 48: '50d',
  51: '09d', 53: '09d', 55: '09d',
  61: '10d', 63: '10d', 65: '10d',
  71: '13d', 73: '13d', 75: '13d',
  80: '09d', 81: '09d', 82: '09d',
  95: '11d', 96: '11d', 99: '11d',
};

@Injectable()
export class WeatherService {
  async getWeather(city: string): Promise<WeatherData> {
    try {
      const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: city, count: 1, language: 'tr', format: 'json' },
      });

      if (!geoRes.data.results?.length) {
        throw new BadRequestException('Şehir bulunamadı.');
      }

      const { latitude, longitude, name } = geoRes.data.results[0];

      const weatherRes = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,precipitation,snowfall',
          wind_speed_unit: 'kmh',
          timezone: 'auto',
        },
      });

      const c = weatherRes.data.current;
      const code: number = c.weather_code;

      return {
        temp: Math.round(c.temperature_2m),
        feels_like: Math.round(c.apparent_temperature),
        humidity: c.relative_humidity_2m,
        wind_speed: Math.round(c.wind_speed_10m),
        description: WMO_DESCRIPTIONS[code] ?? 'bilinmiyor',
        rain: (code >= 51 && code <= 65) || (code >= 80 && code <= 82),
        snow: code >= 71 && code <= 75,
        city: name,
        icon: WMO_ICONS[code] ?? '01d',
      };
    } catch (e: unknown) {
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('Hava durumu alınamadı.');
    }
  }
}
