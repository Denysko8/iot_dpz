import { injectable, inject } from 'tsyringe';
import { IDataImportService } from '../interfaces/IDataImportService';
import { ICsvReader } from '../../dal/interfaces/ICsvReader';
import { IUserRepository } from '../../dal/interfaces/IUserRepository';
import { IRestaurantRepository } from '../../dal/interfaces/IRestaurantRepository';
import { IHotelRepository } from '../../dal/interfaces/IHotelRepository';
import { IReviewRepository } from '../../dal/interfaces/IReviewRepository';
import { User } from '../../domain/entities/User';
import { Restaurant } from '../../domain/entities/Restaurant';
import { Hotel } from '../../domain/entities/Hotel';
import { Review } from '../../domain/entities/Review';
import { ReviewStatus } from '../../domain/enums/ReviewStatus';

@injectable()
export class DataImportService implements IDataImportService {
  constructor(
    @inject('ICsvReader') private csvReader: ICsvReader,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IRestaurantRepository') private restaurantRepository: IRestaurantRepository,
    @inject('IHotelRepository') private hotelRepository: IHotelRepository,
    @inject('IReviewRepository') private reviewRepository: IReviewRepository
  ) {}

  async importFromCsv(filePath: string): Promise<void> {
    console.log('Reading CSV file...');
    const rows = await this.csvReader.readCsv(filePath);
    
    if (rows.length === 0) {
      console.log('No data found in CSV file');
      return;
    }

    console.log(`Found ${rows.length} rows in CSV file`);

    // Згрупуємо дані для створення унікальних записів
    const usersMap = new Map<string, User>();
    const restaurantsMap = new Map<string, Restaurant>();
    const hotelsMap = new Map<string, Hotel>();
    const reviews: Review[] = [];

    console.log('Processing CSV data...');
    
    for (const row of rows) {
      // Створюємо або отримуємо користувача
      if (!usersMap.has(row.userEmail)) {
        const user = new User();
        user.username = row.username;
        user.email = row.userEmail;
        usersMap.set(row.userEmail, user);
      }

      // Створюємо або отримуємо ресторан/готель
      const entityType = row.entityType; // 'restaurant' або 'hotel'
      const entityName = row.entityName;

      if (entityType === 'restaurant' && !restaurantsMap.has(entityName)) {
        const restaurant = new Restaurant();
        restaurant.name = entityName;
        restaurant.address = row.entityAddress;
        restaurant.averageRating = 0;
        restaurant.cuisineType = row.cuisineType;
        restaurant.menuLink = row.menuLink;
        restaurantsMap.set(entityName, restaurant);
      } else if (entityType === 'hotel' && !hotelsMap.has(entityName)) {
        const hotel = new Hotel();
        hotel.name = entityName;
        hotel.address = row.entityAddress;
        hotel.averageRating = 0;
        hotel.stars = parseInt(row.stars);
        hotelsMap.set(entityName, hotel);
      }

      // Зберігаємо дані для відгуку (створимо після збереження користувачів та закладів)
      reviews.push({
        userEmail: row.userEmail,
        entityType: row.entityType,
        entityName: row.entityName,
        comment: row.comment,
        rating: parseInt(row.rating),
        date: new Date(row.date),
        status: row.status as ReviewStatus
      } as any);
    }

    // Зберігаємо користувачів
    console.log(`Saving ${usersMap.size} users...`);
    const savedUsers = await this.userRepository.saveMany(Array.from(usersMap.values()));
    const userEmailToIdMap = new Map<string, number>();
    savedUsers.forEach(user => userEmailToIdMap.set(user.email, user.id));

    // Зберігаємо ресторани
    console.log(`Saving ${restaurantsMap.size} restaurants...`);
    const savedRestaurants = await this.restaurantRepository.saveMany(Array.from(restaurantsMap.values()));
    const restaurantNameToIdMap = new Map<string, number>();
    savedRestaurants.forEach(restaurant => restaurantNameToIdMap.set(restaurant.name, restaurant.id));

    // Зберігаємо готелі
    console.log(`Saving ${hotelsMap.size} hotels...`);
    const savedHotels = await this.hotelRepository.saveMany(Array.from(hotelsMap.values()));
    const hotelNameToIdMap = new Map<string, number>();
    savedHotels.forEach(hotel => hotelNameToIdMap.set(hotel.name, hotel.id));

    // Створюємо відгуки з правильними зв'язками
    console.log(`Creating ${reviews.length} reviews...`);
    const reviewEntities: Review[] = [];
    
    for (const reviewData of reviews as any[]) {
      const review = new Review();
      review.comment = reviewData.comment;
      review.rating = reviewData.rating;
      review.date = reviewData.date;
      review.status = reviewData.status;
      review.userId = userEmailToIdMap.get(reviewData.userEmail)!;

      if (reviewData.entityType === 'restaurant') {
        review.restaurantId = restaurantNameToIdMap.get(reviewData.entityName)!;
      } else {
        review.hotelId = hotelNameToIdMap.get(reviewData.entityName)!;
      }

      reviewEntities.push(review);
    }

    console.log(`Saving ${reviewEntities.length} reviews...`);
    await this.reviewRepository.saveMany(reviewEntities);

    // Оновлюємо середні рейтинги
    console.log('Updating average ratings...');
    await this.updateAverageRatings();

    console.log('Data import completed successfully!');
  }

  private async updateAverageRatings(): Promise<void> {
    // Оновлюємо середні рейтинги для ресторанів
    const restaurants = await this.restaurantRepository.findAll();
    for (const restaurant of restaurants) {
      const reviews = await this.reviewRepository.findByRestaurantId(restaurant.id);
      if (reviews.length > 0) {
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        restaurant.averageRating = sum / reviews.length;
        await this.restaurantRepository.save(restaurant);
      }
    }

    // Оновлюємо середні рейтинги для готелів
    const hotels = await this.hotelRepository.findAll();
    for (const hotel of hotels) {
      const reviews = await this.reviewRepository.findByHotelId(hotel.id);
      if (reviews.length > 0) {
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        hotel.averageRating = sum / reviews.length;
        await this.hotelRepository.save(hotel);
      }
    }
  }
}
