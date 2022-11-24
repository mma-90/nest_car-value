import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      find: (email: string) => Promise.resolve([{ id: 1, email: 'm@m.com', password: 'password' } as User]),
      findOne: (id: number) => Promise.resolve({ id, email: 'm@m.com', password: 'password' } as User),
      // remove: () => {},
      // update: () => {},
    };

    fakeAuthService = {
      signIn: (email: string, password: string) =>
        Promise.resolve({ id: 1, email: 'm@m.com', password: 'password' } as User),
      // signUp() {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('(CONTROLLER) can instantiate an instance', () => {
    expect(controller).toBeDefined();
  });

  it('(findAllUsers) return list of users based on given email ', async () => {
    const users = await controller.findAllUsers('m@m.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('m@m.com');
  });

  it('(findUser) return single user with given id ', async () => {
    const user = await controller.findUser(1);

    expect(user).toBeDefined();
  });

  it('(findUser) throw NotFoundException error if searching unknown id ', async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findUser(1)).rejects.toThrow(NotFoundException);
  });

  it('(signin) update session obj & return user ', async () => {
    const session = { userId: -1 };

    const body = {
      email: 'm@m.com',
      password: 'password',
    };

    const user = await controller.signin(body, session);

    expect(user).toBeDefined();
    expect(user.email).toEqual('m@m.com');
    expect(session.userId).toEqual(1);
  });
});
