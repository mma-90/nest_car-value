import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // If request have userId it will be truthy value
    const req = context.switchToHttp().getRequest();
    return req.session.userId;
  }
}
