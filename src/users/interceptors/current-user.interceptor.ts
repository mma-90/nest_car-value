import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from './../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // get userId from request

    const req = context.switchToHttp().getRequest();
    const { userId } = req.session;
    console.log('current user inteceptor run');

    // retrieve current user
    if (userId) {
      const currentUser = await this.userService.findOne(userId);
      req.currentUser = currentUser;
      console.log('current user inteceptor repo run');
    }

    return next.handle();
  }
}
