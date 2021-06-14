import { Controller, InternalServerErrorException, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { uploadMultiplePhoto, uploadSinglePhoto } from 'src/utilities/fs/image-upload';
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

  @Post('image-bulk')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    const upload = uploadMultiplePhoto(files);
    if (!upload.success) {
      throw new InternalServerErrorException(`Failed to upload the image`);
    }
    return { ...upload };
  }
}
