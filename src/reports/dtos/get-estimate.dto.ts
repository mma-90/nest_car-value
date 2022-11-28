import { IsString, IsNumber, Min, Max, IsLatitude, IsLongitude } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ obj }) => parseInt(obj.year))
  @IsNumber()
  @Min(1950)
  @Max(2050)
  year: number;

  @Transform(({ obj }) => parseFloat(obj.lat))
  @IsLatitude()
  lat: number;

  @Transform(({ obj }) => parseFloat(obj.lng))
  @IsLongitude()
  lng: number;

  @Transform(({ obj }) => parseInt(obj.millage))
  @IsNumber()
  @Min(0)
  @Max(100000000)
  millage: number;
}
