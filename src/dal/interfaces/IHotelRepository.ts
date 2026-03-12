import { Hotel } from '../../domain/entities/Hotel';

export interface IHotelRepository {
  create(hotel: Omit<Hotel, 'id' | 'reviews'>): Promise<Hotel>;
  findById(id: number): Promise<Hotel | null>;
  findAll(): Promise<Hotel[]>;
  save(hotel: Hotel): Promise<Hotel>;
  saveMany(hotels: Hotel[]): Promise<Hotel[]>;
}
