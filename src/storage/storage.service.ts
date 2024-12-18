import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import StorageConfig from './storage-config';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName = StorageConfig.mediaBucket;

  constructor() {
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = path.basename(file.originalname);
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(fileName);

    const stream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => reject(err));
      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
        resolve(publicUrl);
      });
      stream.end(file.buffer);
    });
  }

  async getFile(fileName: string): Promise<string> {
    const file = this.storage.bucket(this.bucketName).file(fileName);
    const exists = await file.exists();
    if (!exists[0]) {
      throw new Error('File does not exist');
    }
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }
}
