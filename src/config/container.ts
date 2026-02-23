import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../dal/dataSource';

// DAL Repositories
import { UserRepository } from '../dal/repositories/UserRepository';
import { HotelRepository } from '../dal/repositories/HotelRepository';
import { ReviewRepository } from '../dal/repositories/ReviewRepository';
import { CsvReader } from '../dal/repositories/CsvReader';

// BLL Services
import { DataImportService } from '../bll/services/DataImportService';

// Інтерфейси
import { IUserRepository } from '../dal/interfaces/IUserRepository';
import { IHotelRepository } from '../dal/interfaces/IHotelRepository';
import { IReviewRepository } from '../dal/interfaces/IReviewRepository';
import { ICsvReader } from '../dal/interfaces/ICsvReader';
import { IDataImportService } from '../bll/interfaces/IDataImportService';

export async function configureDependencies(): Promise<void> {
  // Ініціалізація DataSource
  await AppDataSource.initialize();
  console.log('Database connection established');

  // Реєстрація DataSource
  container.register<DataSource>(DataSource, {
    useValue: AppDataSource
  });

  // Реєстрація DAL repositories (Dependency Injection через інтерфейси)
  container.register<ICsvReader>('ICsvReader', {
    useClass: CsvReader
  });

  container.register<IUserRepository>('IUserRepository', {
    useClass: UserRepository
  });

  container.register<IHotelRepository>('IHotelRepository', {
    useClass: HotelRepository
  });

  container.register<IReviewRepository>('IReviewRepository', {
    useClass: ReviewRepository
  });

  // Реєстрація BLL services
  container.register<IDataImportService>('IDataImportService', {
    useClass: DataImportService
  });

  console.log('Dependency injection container configured');
}

export { container };
