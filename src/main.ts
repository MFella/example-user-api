import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const configService = await app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  Logger.log(`App is listening on port ${port}`);
}
bootstrap();
