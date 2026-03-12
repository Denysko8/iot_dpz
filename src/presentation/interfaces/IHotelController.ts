export interface IHotelController {
  getAll(): Promise<any>;
  getById(id: number): Promise<any>;
}
