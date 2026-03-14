import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ReviewService } from '../services/ReviewService';

/**
 * MVC Controller — handles all HTTP actions for the User entity.
 */
export class UserController {
  readonly router: Router;

  constructor(
    private userService: UserService,
    private reviewService: ReviewService
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

  /** GET /users */
  async index(_req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAll();
    res.render('users/index', { title: 'Користувачі', users });
  }

  /** GET /users/:id */
  async show(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.redirect('/users'); return; }
    const user = await this.userService.getWithReviews(id);
    if (!user) { res.status(404).render('error', { title: '404', message: 'Користувача не знайдено' }); return; }
    res.render('users/show', { title: user.username, user });
  }

  /** GET /users/new */
  new(_req: Request, res: Response): void {
    res.render('users/new', { title: 'Новий користувач', errors: [], body: {} });
  }

  /** GET /users/:id/edit */
  async edit(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.redirect('/users'); return; }
    const user = await this.userService.getById(id);
    if (!user) { res.status(404).render('error', { title: '404', message: 'Користувача не знайдено' }); return; }
    res.render('users/edit', { title: 'Редагувати користувача', user, errors: [] });
  }

  /** POST /users */
  async create(req: Request, res: Response): Promise<void> {
    const { username, email } = req.body;
    const errors: string[] = [];

    if (!username?.trim()) errors.push('Ім\'я користувача обов\'язкове');
    if (!email?.trim()) errors.push('Email обов\'язковий');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.push('Невірний формат email');

    if (errors.length > 0) {
      res.render('users/new', { title: 'Новий користувач', errors, body: req.body });
      return;
    }

    await this.userService.create({ username: username.trim(), email: email.trim().toLowerCase() });
    res.redirect('/users');
  }

  /** PUT /users/:id */
  async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.redirect('/users'); return; }
    const { username, email } = req.body;
    const errors: string[] = [];

    if (!username?.trim()) errors.push('Ім\'я користувача обов\'язкове');
    if (!email?.trim()) errors.push('Email обов\'язковий');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.push('Невірний формат email');

    if (errors.length > 0) {
      const user = await this.userService.getById(id);
      res.render('users/edit', { title: 'Редагувати користувача', user: { ...user, ...req.body }, errors });
      return;
    }

    await this.userService.update(id, { username: username.trim(), email: email.trim().toLowerCase() });
    res.redirect(`/users/${id}`);
  }

  /** DELETE /users/:id */
  async destroy(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (!isNaN(id)) await this.userService.delete(id);
    res.redirect('/users');
  }
}
