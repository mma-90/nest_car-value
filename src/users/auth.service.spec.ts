import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AuthService],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

describe('AuthService', () => {
  let service: AuthService;

  // before each test
  beforeEach(async () => {
    // create fake copy of dependency
    const fakeUserService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({
          id: 1,
          email,
          password,
        } as User),
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
  it('can instantiate instance of AuthService ', async () => {
    expect(service).toBeDefined();
  });
});
