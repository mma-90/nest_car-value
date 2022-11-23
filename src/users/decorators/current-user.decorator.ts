import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    console.log('current user decorator run');
    // @CurrentUser('x') data = 'x'
    // never tell TS I will not accept attributes so data will never used

    // --------------
    // ctx: current context, it can be http request, socket ...
    const request = ctx.switchToHttp().getRequest();

    /* 
    - custom outside decorator have no access to userServices to get user from db
    
    How We can get user from db ? Interceptors can 
    */
    const { currentUser } = request; // now I current User

    return currentUser;
  },
);
