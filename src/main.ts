import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import chalk from 'chalk';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import { Request, Response, NextFunction } from 'express';

chalk.level = 1; // force basic colors

async function bootstrap() {
  // Création de l'application NestJS
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // seuls les logs d'erreur et warning seront affichés
  });

  // Middleware global pour logger toutes les requêtes HTTP
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      // Colorer la méthode HTTP
      const method = chalk.cyan(req.method);

      // Colorer le path
      const path = chalk.blue(req.path);

      // Colorer le status selon le code
      let status: string;
      if (res.statusCode >= 500) status = chalk.red(res.statusCode.toString());
      else if (res.statusCode >= 400)
        status = chalk.yellow(res.statusCode.toString());
      else status = chalk.green(res.statusCode.toString());

      console.log(`✅ ${method} ${path} [${status}]`);
    });
    next();
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
