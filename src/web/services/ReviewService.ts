import { DataSource, Repository } from 'typeorm';
import { Review } from '../../domain/entities/Review';
import { ReviewStatus } from '../../domain/enums/ReviewStatus';

/**
 * BLL Service — encapsulates all business logic for Reviews.
 */
export class ReviewService {
  private reviewRepo: Repository<Review>;

  constructor(dataSource: DataSource) {
    this.reviewRepo = dataSource.getRepository(Review);
  }

  async getAll(): Promise<Review[]> {
    return this.reviewRepo.find({
      relations: ['user', 'hotel'],
      order: { date: 'DESC' },
    });
  }

  async getById(id: number): Promise<Review | null> {
    return this.reviewRepo.findOne({ where: { id }, relations: ['user', 'hotel'] });
  }

  async getByHotelId(hotelId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { hotelId },
      relations: ['user'],
      order: { date: 'DESC' },
    });
  }

  async getByUserId(userId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { userId },
      relations: ['hotel'],
      order: { date: 'DESC' },
    });
  }

  async create(data: {
    comment: string;
    rating: number;
    userId: number;
    hotelId: number;
    status?: ReviewStatus;
  }): Promise<Review> {
    const review = this.reviewRepo.create({
      ...data,
      date: new Date(),
      status: data.status ?? ReviewStatus.PENDING,
    });
    return this.reviewRepo.save(review);
  }

  async update(
    id: number,
    data: Partial<{ comment: string; rating: number; status: ReviewStatus }>
  ): Promise<Review | null> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) return null;
    Object.assign(review, data);
    return this.reviewRepo.save(review);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.reviewRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
