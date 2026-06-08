import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class OutfitsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private weather: WeatherService,
  ) {}

  async generateOutfit(userId: string, occasion: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { city: true, isModestMode: true, stylePreferences: true },
    });

    const wardrobe = await this.prisma.clothing.findMany({
      where: { userId },
      select: { id: true, name: true, category: true, color: true, style: true, season: true, isModest: true },
    });

    const recentOutfits = await this.prisma.outfit.findMany({
      where: { userId },
      take: 5,
      orderBy: { date: 'desc' },
      include: { items: { include: { clothing: { select: { name: true } } } } },
    });

    const recentNames = recentOutfits.flatMap(o => o.items.map(i => i.clothing.name));

    const weatherData = user?.city
      ? await this.weather.getWeather(user.city)
      : { temp: 20, feels_like: 20, description: 'açık', rain: false, snow: false, humidity: 50, wind_speed: 10, city: 'İstanbul', icon: '01d' };

    const suggestion = await this.ai.generateOutfit({
      wardrobe: wardrobe as any,
      weather: weatherData,
      occasion,
      isModestMode: user?.isModestMode || false,
      userStyle: user?.stylePreferences || [],
      recentOutfits: recentNames,
    });

    const outfit = await this.prisma.outfit.create({
      data: {
        userId,
        occasion,
        weatherData: weatherData as any,
        totalScore: suggestion.totalScore,
        harmonyScore: suggestion.harmonyScore,
        comfortScore: suggestion.comfortScore,
        weatherScore: suggestion.weatherScore,
        items: {
          create: suggestion.items.map(item => ({
            clothingId: item.clothingId,
            role: item.role,
          })),
        },
      },
      include: {
        items: { include: { clothing: true } },
      },
    });

    await Promise.all(
      suggestion.items.map(item =>
        this.prisma.clothing.update({
          where: { id: item.clothingId },
          data: { timesWorn: { increment: 1 }, lastWornAt: new Date() },
        }),
      ),
    );

    return { outfit, explanation: suggestion.explanation, colorAnalysis: suggestion.colorAnalysis };
  }

  async findAll(userId: string) {
    return this.prisma.outfit.findMany({
      where: { userId },
      include: { items: { include: { clothing: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async findByDateRange(userId: string, start: string, end: string) {
    return this.prisma.outfit.findMany({
      where: {
        userId,
        date: { gte: new Date(start), lte: new Date(end) },
      },
      include: { items: { include: { clothing: true } } },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const outfit = await this.prisma.outfit.findUnique({
      where: { id },
      include: { items: { include: { clothing: true } } },
    });
    if (!outfit) throw new NotFoundException('Kombin bulunamadı');
    if (outfit.userId !== userId) throw new ForbiddenException();
    return outfit;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.outfit.delete({ where: { id } });
  }

  async getCalendar(userId: string, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    return this.prisma.outfit.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: { items: { include: { clothing: { select: { id: true, name: true, imageUrl: true, category: true } } } } },
      orderBy: { date: 'asc' },
    });
  }
}
