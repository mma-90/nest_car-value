import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from './../users.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // get userId from request

    const req = context.switchToHttp().getRequest();
    const { userId } = req.session;
    console.log('current user interceptor run', userId);

    // console.log('body', req.body); //return body before applying validation pipe
    // retrieve current user
    if (userId) {
      const currentUser = await this.userService.findOne(userId);
      req.currentUser = currentUser;
      console.log('current user interceptor repo run');
    } else {
      throw new UnauthorizedException('You must sign in first');
    }

    return next.handle();
  }
}
