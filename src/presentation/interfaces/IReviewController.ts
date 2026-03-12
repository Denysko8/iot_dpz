export interface IReviewController {
  getAll(): Promise<any>;
  getByUserId(userId: number): Promise<any>;
}
