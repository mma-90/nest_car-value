import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  const users: User[] = [];

  // before each test
  beforeEach(async () => {
    // create fake copy of dependency
    fakeUserService = {
      find: (email: string) => {
        const filtered = users.filter((el) => el.email === email);
        return Promise.resolve(filtered);
      },

      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    // create module that supposed to be tested with its dependencies
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    // create service instance of testing module to test it
    service = module.get<AuthService>(AuthService);
  });

  // test 1: tell tester what we are expected in the result
  it('(AuthService) can instantiate an instance ', async () => {
    expect(service).toBeDefined();
  });

  it('(SIGNUP) create new user with salt and hashing', async () => {
    const user = await service.signUp('m@m.com', 'password');
    const [salt, hash] = user.password.split('.');

    expect(user.email).toEqual('m@m.com');
    expect(user.password).not.toEqual('password');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('(SIGNUP) throw an error if signing up with used email', async () => {
    await expect(service.signUp('m@m.com', 'password')).rejects.toThrowError(BadRequestException);
  });

  it('(SIGN IN) with unused email throw NotFoundException exception', async () => {
    await expect(service.signIn('unused@m.com', 'password')).rejects.toThrowError(NotFoundException);
  });

  it('(SIGN IN) with wrong password throw BadRequestException exception', async () => {
    await expect(service.signIn('m@m.com', 'wrongpassword')).rejects.toThrowError(BadRequestException);
  });

  it('(SIGN IN) return user if passing good Credentials ', async () => {
    const user = await service.signIn('m@m.com', 'password');
    expect(user).toBeDefined();
  });
});
