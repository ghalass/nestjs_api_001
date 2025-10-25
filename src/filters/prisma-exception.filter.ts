// filters/prisma-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Violation de contrainte unique
    if (exception.code === 'P2002') {
      const target = Array.isArray(exception.meta?.target)
        ? exception.meta.target.join(', ')
        : exception.meta?.target;
      response.status(409).json({
        statusCode: 409,
        message: `Duplicate value: ${target}`,
        error: 'Conflict',
      });
      return;
    }

    // Autres erreurs Prisma
    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
