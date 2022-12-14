import { Expose, Transform } from 'class-transformer';
export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  millage: number;

  @Expose()
  status: boolean;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;
}
