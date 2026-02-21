export interface IRestaurantController {
  getAll(): Promise<any>;
  getById(id: number): Promise<any>;
}
