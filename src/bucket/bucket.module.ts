import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';


@Module({
  controllers: [],
  providers: [BucketService],
})
export class BucketModule {}
