import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/reports.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // creating db connection
      type: 'sqlite', //db type
      database: 'db.sqlite', //db name
      entities: [User, Report],
      synchronize: true, //not recommended in production, work as hot fast migration
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
