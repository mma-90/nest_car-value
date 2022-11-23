import { Expose, Exclude } from 'class-transformer';

export class UserDto {
  @Expose() // share with outside
  id: number;

  @Expose()
  email: string;

  // @Exclude()
  // password: string;
  // you need to disable  excludeExtraneousValues: true in interceptor transform plainInstance
}
