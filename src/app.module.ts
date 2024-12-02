import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'nestjs-prisma';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { BucketModule } from './bucket/bucket.module';
import appConfig from './config/app.config';

@Module({
  imports: [PrismaModule.forRoot({ isGlobal: true }), ConfigModule.forRoot({
    isGlobal: true, 
    load: [appConfig],
  }), BucketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
