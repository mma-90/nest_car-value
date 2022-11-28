import { Controller } from '@nestjs/common';
import { Post, Get, Body, UseGuards, Param, Patch } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { User } from 'src/users/user.entity';
import { CurrentUserInterceptor } from './../users/interceptors/current-user.interceptor';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { IsAdminGuard } from './../guards/isAdmin.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    console.log(user);
    return this.reportsService.create(body, user);
  }

  @Get()
  getEstimate(@Param() param: any, @CurrentUser() user: User) {
    return this.reportsService.getEstimate(param, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, IsAdminGuard)
  changeApproval(@Param('id') id: number, @Body() body: any, @CurrentUser() user: User) {
    return this.reportsService.changeApproval(id, body.approved, user);
  }
}
