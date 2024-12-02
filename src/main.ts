import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { createLoggerConfig } from './config/logger.config';
import { Application } from './app';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

async function bootstrap() {
  const environment = process.env.NODE_ENV || 'development';
  
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(createLoggerConfig(environment)),
  });

  const configService = app.get(ConfigService);
  
  const mongoUri = configService.get<string>('mongodb.uri');
  await mongoose.connect(mongoUri);
  
  const application = new Application(app, configService);
  await application.configure();
  await application.start();
}

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  process.exit(0);
});

if (require.main === module) {
  bootstrap();
}

export { bootstrap }; //for testing