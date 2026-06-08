import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomUUID } from 'crypto';

const GITHUB_OWNER = 'salihtombuloglu771-stack';
const GITHUB_REPO = 'smart-wardrobe-images';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main`;

@Injectable()
export class StorageService {
  private readonly token: string;

  constructor(private config: ConfigService) {
    this.token = this.config.get('GITHUB_TOKEN') as string;
  }

  async uploadClothingImage(buffer: Buffer, userId: string): Promise<{ url: string; publicId: string }> {
    const filename = `${userId}/${randomUUID()}.jpg`;
    const content = buffer.toString('base64');

    await axios.put(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`,
      { message: `upload ${filename}`, content },
      { headers: { Authorization: `token ${this.token}`, 'Content-Type': 'application/json' } },
    );

    return { url: `${RAW_BASE}/${filename}`, publicId: filename };
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      const { data } = await axios.get(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${publicId}`,
        { headers: { Authorization: `token ${this.token}` } },
      );
      await axios.delete(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${publicId}`,
        {
          data: { message: `delete ${publicId}`, sha: data.sha },
          headers: { Authorization: `token ${this.token}`, 'Content-Type': 'application/json' },
        },
      );
    } catch {
      // silently ignore delete failures
    }
  }
}
