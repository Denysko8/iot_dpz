import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Hotel } from '../../domain/entities/Hotel';
import { IHotelRepository } from '../interfaces/IHotelRepository';

@injectable()
export class HotelRepository implements IHotelRepository {
  private repository: Repository<Hotel>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(Hotel);
  }

  async create(hotelData: Omit<Hotel, 'id' | 'reviews'>): Promise<Hotel> {
    const hotel = this.repository.create(hotelData);
    return await this.repository.save(hotel);
  }

  async findById(id: number): Promise<Hotel | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Hotel[]> {
    return await this.repository.find();
  }

  async save(hotel: Hotel): Promise<Hotel> {
    return await this.repository.save(hotel);
  }

  async saveMany(hotels: Hotel[]): Promise<Hotel[]> {
    return await this.repository.save(hotels);
  }
}
