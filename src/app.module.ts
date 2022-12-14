import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/reports.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    // TypeOrmModule.forRoot({
    //   // creating db connection
    //   type: 'sqlite', //db type
    //   database: 'db.sqlite', //db name
    //   entities: [User, Report],
    //   synchronize: true, //not recommended in production, work as hot fast migration
    // }),

    // using config module env variables
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: process.env.DATABASE_NAME,
        // entities: [User, Report],
        autoLoadEntities: true, // this will load all entities that their module inject TypeOrmModule.forFeature()
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      // inject global pipe to be able to used in test and development
      useValue: new ValidationPipe({
        whitelist: true, // ignore unrecognized request body properties
      }),
    },
  ],
})

// injecting global middleware to be used in test also
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          // keys: [process.env.COOKIE_KEY],
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*'); //for all routes

    // 2nd middleware for specific endpoint
    // consumer
    //   .apply((_req, _res, next) => {
    //     console.log('I am middleware');
    //     next();
    //   })
    //   .forRoutes('/auth/signin');
  }
}
