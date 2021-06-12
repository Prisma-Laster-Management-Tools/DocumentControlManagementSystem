import { Controller, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadSinglePhoto } from 'src/utilities/fs/image-upload';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image-single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const upload = await uploadSinglePhoto(file);
    if (!upload.success) {
      throw new InternalServerErrorException(`Failed to upload the image`);
    }
    return { ...upload };
  }
}
