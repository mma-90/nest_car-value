import { User } from '../users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string; //Toyota

  @Column()
  model: string; //Yaris

  @Column()
  year: number;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  millage: number;

  @Column({ default: false })
  status: boolean;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
