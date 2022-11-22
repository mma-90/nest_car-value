import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

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
}
