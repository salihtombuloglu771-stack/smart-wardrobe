import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, Request,
  UseInterceptors, UploadedFile, ParseFilePipe,
  MaxFileSizeValidator, FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClothingService } from './clothing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateClothingDto } from './dto/clothing.dto';

@Controller('clothing')
@UseGuards(JwtAuthGuard)
export class ClothingController {
  constructor(private clothing: ClothingService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  uploadAndAnalyze(
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.clothing.uploadAndAnalyze(req.user.id, file);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('category') category?: string,
    @Query('season') season?: string,
    @Query('style') style?: string,
  ) {
    return this.clothing.findAll(req.user.id, { category, season, style });
  }

  @Get('stats')
  getStats(@Request() req: any) {
    return this.clothing.getStats(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.clothing.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateClothingDto) {
    return this.clothing.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.clothing.remove(id, req.user.id);
  }
}
