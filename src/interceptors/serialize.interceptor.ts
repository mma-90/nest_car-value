import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UserDto } from 'src/users/dtos/user.dto';
import { plainToClass, plainToInstance } from 'class-transformer';

// as Serialize take dto: any but it should to be dto class
// used for typescript to make sure that interceptor receive at least class not string not number ....
// I can't do more than that as I don't know dto shape that I will receive as it will be different for every case.
interface ClassConstructor {
  new (...args: any[]); //this is mean it must be class
}

// create custom decorator
// save writing importing lines in all controllers that use this interceptor decorator
// export function Serialize(dto: any) {
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('I run before request handler');
    // console.log(context); //context is request object

    // handle() make handle function in controller run first
    return next.handle().pipe(
      map((data) => {
        // console.log('I run after request handler', data);
        console.log('from serialize interceptor', data);

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

/*
Interceptor: 
-used for many cases one of them is to transform shape of data before or
 after request handler

-It must implement NestInterceptor
-It applied on controller 
-Can be applied on class level or function level 
-class level will be applied in all methods in the class 
-function level: applied only for this method
*/
