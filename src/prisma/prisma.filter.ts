import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Database error';

    switch (exception.code) {
      // -----------------------------------------------------
      // UNIQUE FIELDS — P2002
      // -----------------------------------------------------
      case 'P2002': {
        // Prisma gives list of fields that violated unique constraint
        const fields = exception.meta?.target as string[] | undefined;

        if (fields?.length) {
          message = `${fields.join(', ')} already exists`;
        } else {
          message = 'Duplicate value';
        }

        status = HttpStatus.CONFLICT;
        break;
      }

      // -----------------------------------------------------
      // RECORD NOT FOUND — P2025
      // -----------------------------------------------------
      case 'P2025': {
        message = 'Record not found';
        status = HttpStatus.NOT_FOUND;
        break;
      }

      // -----------------------------------------------------
      // FOREIGN KEY FAILED — P2003
      // -----------------------------------------------------
      case 'P2003': {
        message = `Invalid relation: ${exception.meta?.field_name as string}`;
        status = HttpStatus.BAD_REQUEST;
        break;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.message,
    });
  }
}
