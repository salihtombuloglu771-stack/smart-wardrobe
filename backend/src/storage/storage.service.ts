import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadClothingImage(buffer: Buffer, userId: string): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `smart-wardrobe/${userId}/clothing`,
          transformation: [{ width: 800, height: 1000, crop: 'fill', gravity: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result!.secure_url, publicId: result!.public_id });
        },
      );
      Readable.from(buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
