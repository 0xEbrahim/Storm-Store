import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        status: 'Success',
        data,
        timestamp: Date.now(),
      })),
      catchError((err) => {
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const errorResponse = {
          statusCode,
          message: err.message || 'Internal server error',
          error: err.name || 'Error',
          timestamp: Date.now(),
          path: request.url,
          data: {},
        };
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
