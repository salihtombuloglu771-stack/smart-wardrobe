import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { OutfitsService } from './outfits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('outfits')
@UseGuards(JwtAuthGuard)
export class OutfitsController {
  constructor(private outfits: OutfitsService) {}

  @Post('generate')
  generate(@Request() req: any, @Body('occasion') occasion: string) {
    return this.outfits.generateOutfit(req.user.id, occasion || 'Günlük');
  }

  @Get()
  findAll(@Request() req: any) {
    return this.outfits.findAll(req.user.id);
  }

  @Get('calendar')
  getCalendar(
    @Request() req: any,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.outfits.getCalendar(req.user.id, parseInt(year), parseInt(month));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.outfits.findOne(id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.outfits.remove(id, req.user.id);
  }
}
