import { Review } from '../../domain/entities/Review';

export interface IReviewRepository {
  create(review: Omit<Review, 'id'>): Promise<Review>;
  findById(id: number): Promise<Review | null>;
  findAll(): Promise<Review[]>;
  findByUserId(userId: number): Promise<Review[]>;
  findByRestaurantId(restaurantId: number): Promise<Review[]>;
  findByHotelId(hotelId: number): Promise<Review[]>;
  save(review: Review): Promise<Review>;
  saveMany(reviews: Review[]): Promise<Review[]>;
}
