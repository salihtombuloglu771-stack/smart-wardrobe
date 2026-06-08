import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('weather')
@UseGuards(JwtAuthGuard)
export class WeatherController {
  constructor(private weather: WeatherService) {}

  @Get()
  getWeather(@Query('city') city: string) {
    return this.weather.getWeather(city || 'Istanbul');
  }
}
