import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import methodOverride from 'method-override';
import { DataSource } from 'typeorm';
import { HotelController } from './controllers/HotelController';
import { ReviewController } from './controllers/ReviewController';
import { UserController } from './controllers/UserController';
import { HotelService } from './services/HotelService';
import { ReviewService } from './services/ReviewService';
import { UserService } from './services/UserService';

export function createApp(dataSource: DataSource): Application {
  const app = express();

  // View engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(methodOverride('_method'));
  app.use(express.static(path.join(__dirname, 'public')));

  // Business Logic Layer (BLL) — services
  const hotelService = new HotelService(dataSource);
  const reviewService = new ReviewService(dataSource);
  const userService = new UserService(dataSource);

  // Controllers
  const hotelController = new HotelController(hotelService, reviewService, userService);
  const reviewController = new ReviewController(reviewService, hotelService, userService);
  const userController = new UserController(userService, reviewService);

  // Routes
  app.get('/', (_req: Request, res: Response) => res.redirect('/hotels'));
  app.use('/hotels', hotelController.router);
  app.use('/reviews', reviewController.router);
  app.use('/users', userController.router);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).render('error', { title: 'Not Found', message: 'Page not found' });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).render('error', { title: 'Server Error', message: 'Internal server error' });
  });

  return app;
}
