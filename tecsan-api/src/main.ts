import { config } from 'dotenv';
config();

import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { CustomPrismaExceptionFilter } from './filters/prisma-exception.filter';

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

async function bootstrap() {
  const corsOptions = {
    origin: ['http://localhost:3000', FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  };

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsOptions,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  app.get(HttpAdapterHost);
  app.useGlobalFilters(new CustomPrismaExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useLogger(new Logger());

  const config = new DocumentBuilder()
    .setTitle('Tecsan API')
    .setDescription('Documentação da API do projeto Tecsan')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  console.log(`Server started at port: ${PORT}`);
}

bootstrap();
