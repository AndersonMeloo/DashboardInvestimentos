import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((error) =>
          error.constraints ? Object.values(error.constraints) : [],
        );

        return new BadRequestException(
          messages.length > 0
            ? messages.join(' | ')
            : 'Dados de entrada inválidos',
        );
      },
    }),
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
