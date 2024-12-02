import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BucketService } from './bucket.service';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FileUploadInterceptor.name);

  constructor(private readonly bucketService: BucketService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: any = context.switchToHttp().getRequest();

    if (request.file) {
      this.logger.log(`Processing single file upload`);
      const meta = await this.bucketService.upload(request.file);
      request.bucket_uploads = meta;
    } else if (Array.isArray(request.files)) {
      this.logger.log(
        `Processing multiple files upload: ${request.files.length} files`,
      );
      const meta = await this.bucketService.uploadMany(request.files);
      request.bucket_uploads = meta;
    } else if (request.files) {
      this.logger.log(`Processing multi-field file upload`);
      const filesMeta = {};
      const uploadPromises = [];

      for (const fieldname in request.files) {
        if (!request.files[fieldname]) {
          this.logger.error(`Invalid file in field: ${fieldname}`);
          throw new BadRequestException(`Invalid file in field: ${fieldname}`);
        }
        uploadPromises.push(
          this.bucketService
            .uploadMany(request.files[fieldname])
            .then((meta) => {
              this.logger.debug(
                `Successfully uploaded files for field: ${fieldname}`,
              );
              filesMeta[fieldname] = meta;
            })
            .catch((error) => {
              this.logger.error(
                `Failed to upload file in field ${fieldname}`,
                error.stack,
              );
              throw new InternalServerErrorException(
                `Failed to upload file in field ${fieldname}: ${error.message}`,
              );
            }),
        );
      }

      await Promise.all(uploadPromises);
      request.bucket_uploads = filesMeta;
    }

    return next.handle().pipe(
      catchError((error) => {
        this.logger.error('Error processing file upload request', error.stack);
        return throwError(
          () =>
            new InternalServerErrorException(
              `File processing failed: ${error.message}`,
            ),
        );
      }),
    );
  }
}
