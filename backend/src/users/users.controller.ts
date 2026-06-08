import { Controller, Get, Patch, Body, Request, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  getProfile(@Request() req: any) {
    return this.users.getProfile(req.user.id);
  }

  @Patch('me')
  updateProfile(@Request() req: any, @Body() body: any) {
    return this.users.updateProfile(req.user.id, body);
  }

  @Get('wardrobe-analysis')
  analyzeWardrobe(@Request() req: any) {
    return this.users.analyzeWardrobe(req.user.id);
  }

  @Get('shal-advice')
  getShalAdvice(@Request() req: any, @Query('occasion') occasion: string) {
    return this.users.getShalAdvice(req.user.id, occasion || 'Günlük');
  }
}
