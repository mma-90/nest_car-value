import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Session,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { AuthGuard } from './../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto) // applied on class level
// @UseInterceptors(new SerializeInterceptor(UserDto))
@UseInterceptors(CurrentUserInterceptor) // applied for all methods
export class UsersController {
  constructor(private userService: UsersService, private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: Record<string, any>) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/signout')
  signOut(@Session() session: Record<string, any>) {
    session.userId = null;
  }

  // @Get('/me')
  // whoAmI(@Session() session: Record<string, any>) {
  //   return this.userService.findOne(session.userId);
  // }

  /*
    What I need ? 
    I need to get current user id from request session and then retrieve it from db using repo service
    */

  @Get('/me')
  @UseGuards(AuthGuard)
  // @UseInterceptors(CurrentUserInterceptor)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  // applied on function level
  // @Serialize(UserDto) //custom decorator
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    // console.log('Handler is running');

    const user = await this.userService.findOne(id);

    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
