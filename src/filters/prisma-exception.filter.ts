// filters/prisma-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      // Violation de contrainte unique
      case 'P2002': {
        const target = Array.isArray(exception.meta?.target)
          ? exception.meta.target.join(', ')
          : exception.meta?.target;
        response.status(409).json({
          statusCode: 409,
          message: `Duplicate value: ${target}`,
          error: 'Conflict',
        });
        break;
      }

      // Record not found
      case 'P2025': {
        response.status(404).json({
          statusCode: 404,
          message: 'Record not found',
          error: 'Not Found',
        });
        break;
      }

      // Violation de clé étrangère (record is used)
      case 'P2003': {
        const field = Array.isArray(exception.meta?.field_name)
          ? exception.meta.field_name.join(', ')
          : exception.meta?.field_name;
        response.status(400).json({
          statusCode: 400,
          message: `Cannot delete/update record because it is referenced in ${field}`,
          error: 'Bad Request',
        });
        break;
      }

      // Autres erreurs Prisma
      default: {
        response.status(500).json({
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
        });
        break;
      }
    }
  }
}
