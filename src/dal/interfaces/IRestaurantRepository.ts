import { Restaurant } from '../../domain/entities/Restaurant';

export interface IRestaurantRepository {
  create(restaurant: Omit<Restaurant, 'id' | 'reviews'>): Promise<Restaurant>;
  findById(id: number): Promise<Restaurant | null>;
  findAll(): Promise<Restaurant[]>;
  save(restaurant: Restaurant): Promise<Restaurant>;
  saveMany(restaurants: Restaurant[]): Promise<Restaurant[]>;
}
