import { Router, Request, Response } from 'express';
import { HotelService } from '../services/HotelService';
import { ReviewService } from '../services/ReviewService';
import { UserService } from '../services/UserService';

/**
 * MVC Controller — handles all HTTP actions for the Hotel entity.
 * Routes: GET/POST /hotels, GET/PUT/DELETE /hotels/:id
 */
export class HotelController {
  readonly router: Router;

  constructor(
    private hotelService: HotelService,
    private reviewService: ReviewService,
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
    this.router.get('/:id', this.show.bind(this));
  }

  /** GET /hotels — list all hotels */
  async index(req: Request, res: Response): Promise<void> {
    const hotels = await this.hotelService.getAll();
    res.render('hotels/index', { title: 'Готелі', hotels });
  }

  /** GET /hotels/:id — show hotel details with reviews */
  async show(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.redirect('/hotels'); return; }
    const hotel = await this.hotelService.getWithReviews(id);
    if (!hotel) { res.status(404).render('error', { title: '404', message: 'Готель не знайдено' }); return; }
    res.render('hotels/show', { title: hotel.name, hotel });
  }

  /** GET /hotels/new — show create form */
  new(_req: Request, res: Response): void {
    res.render('hotels/new', { title: 'Новий готель', errors: [], body: {} });
  }

  /** GET /hotels/:id/edit — show edit form */
  async edit(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.redirect('/hotels'); return; }
    const hotel = await this.hotelService.getById(id);
    if (!hotel) { res.status(404).render('error', { title: '404', message: 'Готель не знайдено' }); return; }
    res.render('hotels/edit', { title: 'Редагувати готель', hotel, errors: [] });
  }

  /** POST /hotels — create new hotel */
  async create(req: Request, res: Response): Promise<void> {
    const { name, address, stars } = req.body;
    const errors: string[] = [];

    if (!name?.trim()) errors.push('Назва обов\'язкова');
    if (!address?.trim()) errors.push('Адреса обов\'язкова');
    const starsNum = parseInt(stars, 10);
    if (isNaN(starsNum) || starsNum < 1 || starsNum > 5) errors.push('Зірки: від 1 до 5');

    if (errors.length > 0) {
      res.render('hotels/new', { title: 'Новий готель', errors, body: req.body });
      return;
    }

    await this.hotelService.create({ name: name.trim(), address: address.trim(), stars: starsNum });
    res.redirect('/hotels');
  }

  /** PUT /hotels/:id — update hotel */
  async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.redirect('/hotels'); return; }
    const { name, address, stars } = req.body;
    const errors: string[] = [];

    if (!name?.trim()) errors.push('Назва обов\'язкова');
    if (!address?.trim()) errors.push('Адреса обов\'язкова');
    const starsNum = parseInt(stars, 10);
    if (isNaN(starsNum) || starsNum < 1 || starsNum > 5) errors.push('Зірки: від 1 до 5');

    if (errors.length > 0) {
      const hotel = await this.hotelService.getById(id);
      res.render('hotels/edit', { title: 'Редагувати готель', hotel: { ...hotel, ...req.body }, errors });
      return;
    }

    await this.hotelService.update(id, { name: name.trim(), address: address.trim(), stars: starsNum });
    res.redirect(`/hotels/${id}`);
  }

  /** DELETE /hotels/:id — delete hotel */
  async destroy(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (!isNaN(id)) await this.hotelService.delete(id);
    res.redirect('/hotels');
  }
}
