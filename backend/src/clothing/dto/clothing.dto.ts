import { IsString, IsEnum, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ClothingCategory, Season } from '@prisma/client';

export class CreateClothingDto {
  @IsString()
  name!: string;

  @IsEnum(ClothingCategory)
  category!: ClothingCategory;

  @IsString()
  color!: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  pattern?: string;

  @IsOptional()
  @IsString()
  fabric?: string;

  @IsArray()
  season!: Season[];

  @IsArray()
  style!: string[];

  @IsOptional()
  @IsString()
  fit?: string;

  @IsOptional()
  @IsBoolean()
  isModest?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateClothingDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ClothingCategory)
  category?: ClothingCategory;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsArray()
  season?: Season[];

  @IsOptional()
  @IsArray()
  style?: string[];

  @IsOptional()
  @IsBoolean()
  isModest?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
