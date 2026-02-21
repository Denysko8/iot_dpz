import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Restaurant } from '../../domain/entities/Restaurant';
import { IRestaurantRepository } from '../interfaces/IRestaurantRepository';

@injectable()
export class RestaurantRepository implements IRestaurantRepository {
  private repository: Repository<Restaurant>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(Restaurant);
  }

  async create(restaurantData: Omit<Restaurant, 'id' | 'reviews'>): Promise<Restaurant> {
    const restaurant = this.repository.create(restaurantData);
    return await this.repository.save(restaurant);
  }

  async findById(id: number): Promise<Restaurant | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Restaurant[]> {
    return await this.repository.find();
  }

  async save(restaurant: Restaurant): Promise<Restaurant> {
    return await this.repository.save(restaurant);
  }

  async saveMany(restaurants: Restaurant[]): Promise<Restaurant[]> {
    return await this.repository.save(restaurants);
  }
}
