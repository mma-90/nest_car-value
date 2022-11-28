import { Report } from './../reports/reports.entity';
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: true })
  isAdmin: boolean;

  @Column()
  password: string;

  // more logic using hooks (Entity Listeners)
  @AfterInsert()
  logCreateUser() {
    console.log(`LOG: Created user with id ${this.id}`);
  }

  @AfterRemove()
  logRemoveUser() {
    console.log(`LOG: Removed user with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdateUser() {
    console.log(`LOG: Updated user with id ${this.id}`);
  }

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
