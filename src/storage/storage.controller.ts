import {
  Controller,
  Post,
  Get,
  UploadedFile,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.storageService.uploadFile(file);
    return { success: true, url };
  }

  @Get(':fileName')
  async getFile(@Param('fileName') fileName: string) {
    const url = await this.storageService.getFile(fileName);
    return { success: true, url };
  }
}
