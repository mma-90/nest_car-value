import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('(POST) /signup', () => {
    // delete all records first

    const email = 'm@m.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ password: 'password', email, x: 'xxxxxxxx' }) //x will be ignored by validation pipe
      .expect(201)
      .then((res) => {
        const { email, id } = res.body;
        console.log(res.body);
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });
});
