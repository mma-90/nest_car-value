import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from './../users/user.entity';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = await this.repo.create(reportDto);
    report.user = user;

    console.log(report);
    return this.repo.save(report);
  }

  async getEstimate(getEstimateDto: GetEstimateDto, user: User) {
    const { make, year, lat, lng, millage, model } = getEstimateDto;
    return await this.repo
      .createQueryBuilder('report')
      .select('AVG(report.price)', 'avg_price')
      // .select('id, price, lat')
      .where('report.make = :make', { make })
      .andWhere('status is true')
      .andWhere('report.model = :model', { model })
      .andWhere('report.year = :year', { year })
      .andWhere('report.lat BETWEEN :lat-10 AND :lat+10', { lat }) //within +- 10
      .orderBy('millage', 'DESC')
      .limit(3)
      // .getRawMany();
      .getRawOne();
  }

  async changeApproval(id: number, status: boolean, user: User) {
    if (!user.isAdmin) throw new UnauthorizedException('You are not allowed to do that');

    const report = await this.repo.findOneBy({ id });

    if (!report) throw new NotFoundException('Report Not Found');

    report.status = status;

    return this.repo.save(report);
  }
}
