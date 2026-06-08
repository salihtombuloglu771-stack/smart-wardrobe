import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ClothingService } from './clothing.service';
import { ClothingController } from './clothing.controller';
import { StorageModule } from '../storage/storage.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    StorageModule,
    AiModule,
  ],
  providers: [ClothingService],
  controllers: [ClothingController],
})
export class ClothingModule {}
