import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AiService } from '../ai/ai.service';
import { CreateClothingDto, UpdateClothingDto } from './dto/clothing.dto';

@Injectable()
export class ClothingService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private ai: AiService,
  ) {}

  async uploadAndAnalyze(userId: string, file: Express.Multer.File) {
    const { url } = await this.storage.uploadClothingImage(file.buffer, userId);
    const analysis = await this.ai.analyzeClothing(url);

    const clothing = await this.prisma.clothing.create({
      data: {
        userId,
        imageUrl: url,
        name: analysis.name,
        category: analysis.category as any,
        color: analysis.color,
        secondaryColor: analysis.secondaryColor,
        pattern: analysis.pattern,
        fabric: analysis.fabric,
        season: (analysis.season as any[]) || ['TUM_MEVSIMLER'],
        style: analysis.style || [],
        fit: analysis.fit,
        isModest: analysis.isModest || false,
      },
    });

    return clothing;
  }

  async findAll(userId: string, filters?: { category?: string; season?: string; style?: string }) {
    const where: any = { userId };
    if (filters?.category) where.category = filters.category;
    if (filters?.season) where.season = { has: filters.season };
    if (filters?.style) where.style = { has: filters.style };

    return this.prisma.clothing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const item = await this.prisma.clothing.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Kıyafet bulunamadı');
    if (item.userId !== userId) throw new ForbiddenException();
    return item;
  }

  async update(id: string, userId: string, dto: UpdateClothingDto) {
    await this.findOne(id, userId);
    return this.prisma.clothing.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    const item = await this.findOne(id, userId);
    await this.storage.deleteImage(item.imageUrl);
    return this.prisma.clothing.delete({ where: { id } });
  }

  async getStats(userId: string) {
    const clothes = await this.prisma.clothing.findMany({ where: { userId } });
    const totalItems = clothes.length;
    const byCategory = clothes.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allStyles = clothes.flatMap(c => c.style);
    const styleCount = allStyles.reduce((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostWorn = clothes
      .sort((a, b) => b.timesWorn - a.timesWorn)
      .slice(0, 5)
      .map(c => ({ id: c.id, name: c.name, timesWorn: c.timesWorn, imageUrl: c.imageUrl }));

    return { totalItems, byCategory, styleCount, mostWorn };
  }
}
