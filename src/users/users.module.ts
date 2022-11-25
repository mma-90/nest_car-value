import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // creating user repository
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    CurrentUserInterceptor,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: SerializeInterceptor,
    // },
  ],
})
export class UsersModule {}
