import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, city: true,
        avatarUrl: true, isModestMode: true, colorSeason: true,
        faceShape: true, stylePreferences: true, createdAt: true,
        _count: { select: { clothes: true, outfits: true } },
      },
    });
  }

  async updateProfile(userId: string, data: {
    name?: string;
    city?: string;
    isModestMode?: boolean;
    colorSeason?: string;
    faceShape?: string;
    stylePreferences?: string[];
  }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, name: true, city: true,
        isModestMode: true, colorSeason: true, faceShape: true, stylePreferences: true,
      },
    });
  }

  async analyzeWardrobe(userId: string) {
    const clothes = await this.prisma.clothing.findMany({
      where: { userId },
      select: { style: true, color: true, category: true },
    });
    return this.ai.analyzeWardrobeStyle(clothes as any);
  }

  async getShalAdvice(userId: string, occasion: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { faceShape: true },
    });
    const faceShape = user?.faceShape || 'oval';
    return { advice: await this.ai.getShalTyingAdvice(faceShape, occasion) };
  }
}
