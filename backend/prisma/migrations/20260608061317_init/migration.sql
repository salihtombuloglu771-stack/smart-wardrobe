-- CreateEnum
CREATE TYPE "ClothingCategory" AS ENUM ('UST', 'ALT', 'DIS_GIYIM', 'ELBISE', 'SAL', 'AYAKKABI', 'CANTA', 'AKSESUAR', 'IC_GIYIM', 'SPOR');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('ILKBAHAR', 'YAZ', 'SONBAHAR', 'KIS', 'TUM_MEVSIMLER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "city" TEXT,
    "avatarUrl" TEXT,
    "isModestMode" BOOLEAN NOT NULL DEFAULT false,
    "colorSeason" TEXT,
    "faceShape" TEXT,
    "stylePreferences" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clothing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ClothingCategory" NOT NULL,
    "color" TEXT NOT NULL,
    "secondaryColor" TEXT,
    "pattern" TEXT,
    "fabric" TEXT,
    "season" "Season"[],
    "style" TEXT[],
    "fit" TEXT,
    "imageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "isModest" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "timesWorn" INTEGER NOT NULL DEFAULT 0,
    "lastWornAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clothing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outfit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "occasion" TEXT,
    "weatherData" JSONB,
    "totalScore" DOUBLE PRECISION,
    "harmonyScore" DOUBLE PRECISION,
    "comfortScore" DOUBLE PRECISION,
    "weatherScore" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Outfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutfitItem" (
    "id" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,
    "clothingId" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "OutfitItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clothing" ADD CONSTRAINT "Clothing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outfit" ADD CONSTRAINT "Outfit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitItem" ADD CONSTRAINT "OutfitItem_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "Outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutfitItem" ADD CONSTRAINT "OutfitItem_clothingId_fkey" FOREIGN KEY ("clothingId") REFERENCES "Clothing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
