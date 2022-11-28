import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: number) {
    // const user = await this.repo.findOneBy({ id });
    // console.log(user, typeof user, user instanceof User, user.email);

    if (!id) throw new BadRequestException('invalid user id');
    return this.repo.findOneBy({ id });
  }

  async find(email: string) {
    const users = await this.repo.findBy({ email });
    return users;
  }

  async update(id: number, attr: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    Object.assign(user, attr);
    return this.repo.save(user);
  }

  async remove(id: number) {
    /*
    Using: delete() -> this.repo.delete(id)
    delete user without work hooks, accept plain object 
    this.repo.delete({age: 10}) will delete all users that have the same age, effect many rows
    return this.repo.delete(id);
    */
    /*

    using remove ()
    remove delete entity object, hooks are worked
    I have to find entity first, then remove it (2 calls)
    */
    // I have to find entity first
    const user = await this.repo.findOneBy({ id });

    if (!user) throw new NotFoundException('user not found');

    return this.repo.remove(user);
  }
}
