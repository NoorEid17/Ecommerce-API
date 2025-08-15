import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.set('view engine', 'ejs');
  app.use('/stripe-webhooks', bodyParser.raw({ type: 'application/json' }));
  app.use(express.json());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
