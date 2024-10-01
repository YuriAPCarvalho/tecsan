import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class CustomPrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';    
    
  
    switch (exception.code) {
      case 'P2000':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'O valor fornecido é muito longo.';
        break;
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = `Já existe um registro com o valor fornecido para o campo ${exception.meta.target?.toString()?.toUpperCase()}.`;
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Registro não encontrado.';
        break;
      default:
        message = 'Erro desconhecido.';
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
