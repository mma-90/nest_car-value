import { IsString, IsNumber, Min, Max, IsLatitude, IsLongitude } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1950)
  @Max(2050)
  year: number;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsNumber()
  @Min(0)
  @Max(100000000)
  millage: number;
}
