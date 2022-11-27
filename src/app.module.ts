import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/reports.entity';
import { ConfigModule } from '@nestjs/config';
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

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: process.env.DATABASE_NAME,
        entities: [User, Report],
        synchronize: true,
      }),
    }),

    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['cookies-secret-key'],
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
