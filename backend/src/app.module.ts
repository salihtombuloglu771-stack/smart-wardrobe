import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClothingModule } from './clothing/clothing.module';
import { OutfitsModule } from './outfits/outfits.module';
import { WeatherModule } from './weather/weather.module';
import { AiModule } from './ai/ai.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClothingModule,
    OutfitsModule,
    WeatherModule,
    AiModule,
    StorageModule,
  ],
})
export class AppModule {}
