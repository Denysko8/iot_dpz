import { DataSource, Repository } from 'typeorm';
import { User } from '../../domain/entities/User';

/**
 * BLL Service — encapsulates all business logic for Users.
 */
export class UserService {
  private userRepo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
  }

  async getAll(): Promise<User[]> {
    return this.userRepo.find({ order: { username: 'ASC' } });
  }

  async getById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async getWithReviews(id: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['reviews', 'reviews.hotel'],
      order: { reviews: { date: 'DESC' } } as any,
    });
  }

  async create(data: { username: string; email: string }): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async update(
    id: number,
    data: Partial<{ username: string; email: string }>
  ): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return null;
    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepo.count({ where: { email } });
    return count > 0;
  }
}
