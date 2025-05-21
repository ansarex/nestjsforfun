import {
    UseInterceptors, NestInterceptor, ExecutionContext, CallHandler
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

//as long as its a class i am going to be happy
interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializerInterceptor(dto))
}

export class SerializerInterceptor implements NestInterceptor {
  constructor(private dto:any) {}
  
  intercept(context: ExecutionContext, next: CallHandler) : Observable<any>  {
      // run something before a request is handled byy the request handler
        
      return next.handle().pipe(map((data : any) => {
        // run something before the response sent out
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,

        })
      }))
  }    
}