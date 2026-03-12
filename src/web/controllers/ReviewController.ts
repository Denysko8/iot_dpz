import { Router, Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService';
import { HotelService } from '../services/HotelService';
import { UserService } from '../services/UserService';
import { ReviewStatus } from '../../domain/enums/ReviewStatus';

/**
 * MVC Controller — handles all HTTP actions for the Review entity.
 */
export class ReviewController {
  readonly router: Router;

  constructor(
    private reviewService: ReviewService,
    private hotelService: HotelService,
    private userService: UserService
  ) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get('/', this.index.bind(this));
    this.router.get('/new', this.new.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.get('/:id/edit', this.edit.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.destroy.bind(this));
  }

  /** GET /reviews — list all reviews */
  async index(_req: Request, res: Response): Promise<void> {
    const reviews = await this.reviewService.getAll();
    res.render('reviews/index', { title: 'Відгуки', reviews, statuses: ReviewStatus });
  }

  /** GET /reviews/new — create form */
  async new(_req: Request, res: Response): Promise<void> {
    const [hotels, users] = await Promise.all([
      this.hotelService.getAll(),
      this.userService.getAll(),
    ]);
    res.render('reviews/new', {
      title: 'Новий відгук',
      hotels,
      users,
      statuses: ReviewStatus,
      errors: [],
      body: {},
    });
  }

  /** POST /reviews — create new review */
  async create(req: Request, res: Response): Promise<void> {
    const { comment, rating, userId, hotelId, status } = req.body;
    const errors: string[] = [];

    if (!comment?.trim()) errors.push('Коментар обов\'язковий');
    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) errors.push('Оцінка: від 1 до 10');
    if (!userId || isNaN(parseInt(userId, 10))) errors.push('Оберіть користувача');
    if (!hotelId || isNaN(parseInt(hotelId, 10))) errors.push('Оберіть готель');

    if (errors.length > 0) {
      const [hotels, users] = await Promise.all([
        this.hotelService.getAll(),
        this.userService.getAll(),
      ]);
      res.render('reviews/new', { title: 'Новий відгук', hotels, users, statuses: ReviewStatus, errors, body: req.body });
      return;
    }

    const review = await this.reviewService.create({
      comment: comment.trim(),
      rating: ratingNum,
      userId: parseInt(userId, 10),
      hotelId: parseInt(hotelId, 10),
      status: (status as ReviewStatus) ?? ReviewStatus.PENDING,
    });
    await this.hotelService.recalculateRating(review.hotelId);
    res.redirect('/reviews');
  }

  /** GET /reviews/:id/edit */
  async edit(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.redirect('/reviews'); return; }
    const [review, hotels, users] = await Promise.all([
      this.reviewService.getById(id),
      this.hotelService.getAll(),
      this.userService.getAll(),
    ]);
    if (!review) { res.status(404).render('error', { title: '404', message: 'Відгук не знайдено' }); return; }
    res.render('reviews/edit', { title: 'Редагувати відгук', review, hotels, users, statuses: ReviewStatus, errors: [] });
  }

  /** PUT /reviews/:id */
  async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.redirect('/reviews'); return; }
    const { comment, rating, status } = req.body;

    const ratingNum = parseInt(rating, 10);
    await this.reviewService.update(id, {
      comment: comment?.trim(),
      rating: isNaN(ratingNum) ? undefined : ratingNum,
      status: status as ReviewStatus,
    });

    const review = await this.reviewService.getById(id);
    if (review) await this.hotelService.recalculateRating(review.hotelId);
    res.redirect('/reviews');
  }

  /** DELETE /reviews/:id */
  async destroy(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (!isNaN(id)) {
      const review = await this.reviewService.getById(id);
      await this.reviewService.delete(id);
      if (review) await this.hotelService.recalculateRating(review.hotelId);
    }
    res.redirect('/reviews');
  }
}
