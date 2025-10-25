import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import chalk from 'chalk';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';

async function bootstrap() {
  // Création de l'application NestJS
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // seuls les logs d'erreur et warning seront affichés
  });

  // Pour activer la validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Pour gérer les exceptions Prisma globalement
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Pour démarrer le serveur
  await app.listen(process.env.PORT || 3000);

  // Affichage de l'URL du serveur dans la console avec du style
  console.log(
    chalk.green('👉 API IS RUNNING ON : ') +
      chalk.bold.magenta(`${await app.getUrl()}`),
  );
}
bootstrap();
