import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
// hold auth logic

@Injectable()
export class AuthService {
  // need to access user services to access db
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string) {
    // 1) check email is not used before
    const [user] = await this.userService.find(email);
    if (user) throw new BadRequestException('email are used');

    // 2) if not -> hash password
    // 2.1) generate salt random string
    // 2.2) create hash
    // 2.3) join salt and hash
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const encryptedPass = salt + '.' + hash.toString('hex');

    // 3) save user in db
    return this.userService.create(email, encryptedPass);
  }

  async signIn(email: string, password: string) {
    // 1) get user by email
    const [user] = await this.userService.find(email);
    if (!user) throw new NotFoundException('email not found');

    // 2) getting salt and stored hash from db
    const [salt, storedHash] = user.password.split('.');

    // 3) hash password sent by request
    const hash = ((await scrypt(password, salt, 32)) as Buffer).toString('hex');

    if (hash !== storedHash) throw new BadRequestException('bad credentials');

    return user;
  }
}
