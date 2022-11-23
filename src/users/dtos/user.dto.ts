import { Expose } from 'class-transformer';

export class UserDto {
  @Expose() // share with outside
  id: number;

  @Expose()
  email: string;
}
