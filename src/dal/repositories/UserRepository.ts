import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async create(userData: Omit<User, 'id' | 'reviews'>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async saveMany(users: User[]): Promise<User[]> {
    return await this.repository.save(users);
  }
}
