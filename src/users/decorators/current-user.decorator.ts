import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: never, ctx: ExecutionContext) => {
  console.log('current user decorator run');
  // if I make @CurrentUser('x')  -> data = 'x'
  // never tell TS I will not accept attributes so data will never be used (sent as attribute)

  // --------------
  // ctx: current context, it can be different request types based on communication protocol like http request, socket, grsp ...
  const request = ctx.switchToHttp().getRequest();

  /* 
    - custom outside decorator have no access to userServices to get user from db
    
    How We can get user from db ? Interceptors can 
    */
  const { currentUser } = request; // now I current User

  return currentUser;
});
