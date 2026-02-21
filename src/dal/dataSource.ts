import { DataSource } from 'typeorm';
import { User, Restaurant, Hotel, Review, ReviewableEntity } from '../domain/entities';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [ReviewableEntity, User, Restaurant, Hotel, Review],
});
