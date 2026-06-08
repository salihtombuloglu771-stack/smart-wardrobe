import { Module } from '@nestjs/common';
import { OutfitsService } from './outfits.service';
import { OutfitsController } from './outfits.controller';
import { AiModule } from '../ai/ai.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [AiModule, WeatherModule],
  providers: [OutfitsService],
  controllers: [OutfitsController],
})
export class OutfitsModule {}
