import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    // Log the exception for debugging purposes
    console.error(`RPC Exception caught: ${exception.message}`);
    // Return an observable that emits the error, which will be sent back to the client
    return throwError(() => exception.getError());
  }
}
