import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from './../users/user.entity';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = await this.repo.create(reportDto);
    report.user = user;

    console.log(report);
    return this.repo.save(report);
  }

  getEstimate(getEstimateDto: any, user: User) {
    return getEstimateDto;
  }

  async changeApproval(id: number, status: boolean, user: User) {
    if (!user.isAdmin) throw new UnauthorizedException('You are not allowed to do that');

    const report = await this.repo.findOneBy({ id });

    if (!report) throw new NotFoundException('Report Not Found');

    report.status = status;

    return this.repo.save(report);
  }
}
