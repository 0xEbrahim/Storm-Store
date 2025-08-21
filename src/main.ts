import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/Interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import {
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,

    bodyParser: true,
  });
  app.setGlobalPrefix('/api/v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
    new I18nValidationPipe(),
  );
  const config = new DocumentBuilder()
    .setTitle('Storm Store')
    .setDescription('This is an API for an E-commerce online website')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
