import { DataSource, Repository } from 'typeorm';
import { Hotel } from '../../domain/entities/Hotel';

/**
 * BLL Service — encapsulates all business logic for Hotels.
 * Sits between Controllers and the DAL Repository layer.
 */
export class HotelService {
  private hotelRepo: Repository<Hotel>;

  constructor(dataSource: DataSource) {
    this.hotelRepo = dataSource.getRepository(Hotel);
  }

  async getAll(): Promise<Hotel[]> {
    return this.hotelRepo.find({ order: { name: 'ASC' } });
  }

  async getById(id: number): Promise<Hotel | null> {
    return this.hotelRepo.findOne({ where: { id } });
  }

  async getWithReviews(id: number): Promise<Hotel | null> {
    return this.hotelRepo.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'],
      order: { reviews: { date: 'DESC' } } as any,
    });
  }

  async create(data: { name: string; address: string; stars: number }): Promise<Hotel> {
    const hotel = this.hotelRepo.create({ ...data, averageRating: 0 });
    return this.hotelRepo.save(hotel);
  }

  async update(
    id: number,
    data: Partial<{ name: string; address: string; stars: number }>
  ): Promise<Hotel | null> {
    const hotel = await this.hotelRepo.findOne({ where: { id } });
    if (!hotel) return null;
    Object.assign(hotel, data);
    return this.hotelRepo.save(hotel);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.hotelRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /** Recalculate the average rating from all linked reviews. */
  async recalculateRating(id: number): Promise<void> {
    const hotel = await this.hotelRepo.findOne({ where: { id }, relations: ['reviews'] });
    if (!hotel) return;
    hotel.averageRating =
      hotel.reviews && hotel.reviews.length > 0
        ? Math.round((hotel.reviews.reduce((s, r) => s + r.rating, 0) / hotel.reviews.length) * 10) / 10
        : 0;
    await this.hotelRepo.save(hotel);
  }
}
