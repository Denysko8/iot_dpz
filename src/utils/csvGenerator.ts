import * as fs from 'fs';
import * as path from 'path';

class CsvGenerator {
  private readonly cuisineTypes = [
    'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian',
    'French', 'Thai', 'Greek', 'Spanish', 'Korean',
    'Vietnamese', 'American', 'Turkish', 'Lebanese', 'Brazilian'
  ];

  private readonly restaurantNames = [
    'La Bella Vista', 'Golden Dragon', 'Sakura Sushi', 'El Mariachi', 'Taj Mahal',
    'Le Petit Bistro', 'Bangkok Palace', 'Athena Taverna', 'Casa Barcelona', 'Seoul Kitchen',
    'Pho House', 'The Steakhouse', 'Kebab Corner', 'Cedar Garden', 'Rio Churrasco',
    'Pizza Napoli', 'Dim Sum Palace', 'Tokyo Grill', 'Taco Fiesta', 'Curry Paradise',
    'Chez Pierre', 'Spice Garden', 'Olympus Restaurant', 'Paella Bar', 'Kimchi House'
  ];

  private readonly hotelNames = [
    'Grand Hotel Imperial', 'Sunset Beach Resort', 'Mountain View Lodge', 'City Center Plaza',
    'Royal Palace Hotel', 'Ocean Paradise', 'Metropolitan Inn', 'Garden Pavilion',
    'Sky Tower Hotel', 'Riverside Manor', 'Crystal Palace', 'Golden Gate Inn',
    'Emerald Resort', 'Silver Star Hotel', 'Diamond Suites', 'Pearl Harbor Hotel',
    'Sapphire Lodge', 'Ruby Tower', 'Amber Inn', 'Jade Garden Hotel'
  ];

  private readonly streets = [
    'Main Street', 'Oak Avenue', 'Maple Drive', 'Pine Street', 'Cedar Lane',
    'Elm Road', 'Park Boulevard', 'Lake Avenue', 'River Road', 'Hill Street',
    'Market Square', 'Church Street', 'School Road', 'Station Avenue', 'Bridge Street'
  ];

  private readonly cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
    'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'
  ];

  private readonly comments = [
    'Excellent service and amazing food!',
    'Great experience, will definitely come back.',
    'Food was good but service could be better.',
    'Outstanding quality and atmosphere!',
    'Average experience, nothing special.',
    'Disappointed with the quality.',
    'Absolutely loved it! Highly recommend.',
    'Good value for money.',
    'Not what I expected, quite disappointing.',
    'Perfect place for a special occasion!',
    'Clean and comfortable, staff was friendly.',
    'Beautiful location and great amenities.',
    'Room was spacious and well-maintained.',
    'Breakfast was delicious!',
    'Wi-Fi was slow but everything else was good.'
  ];

  private readonly firstNames = [
    'John', 'Emma', 'Michael', 'Olivia', 'William', 'Ava', 'James', 'Sophia',
    'Robert', 'Isabella', 'David', 'Mia', 'Richard', 'Charlotte', 'Joseph',
    'Amelia', 'Thomas', 'Harper', 'Daniel', 'Evelyn', 'Matthew', 'Abigail',
    'Christopher', 'Emily', 'Andrew', 'Elizabeth', 'Joshua', 'Sofia', 'Ryan',
    'Avery', 'Nicholas', 'Ella', 'Alexander', 'Madison', 'Jonathan', 'Scarlett'
  ];

  private readonly lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson'
  ];

  private readonly statuses = ['PENDING', 'APPROVED', 'REJECTED'];

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private generateUsername(firstName: string, lastName: string): string {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${this.random(1, 999)}`;
  }

  private generateEmail(firstName: string, lastName: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${this.random(1, 999)}@${this.randomElement(domains)}`;
  }

  private generateAddress(): string {
    return `${this.random(1, 9999)} ${this.randomElement(this.streets)}, ${this.randomElement(this.cities)}`;
  }

  private generateDate(): string {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }

  public generate(rowCount: number, outputPath: string): void {
    console.log(`Generating CSV file with ${rowCount} rows...`);

    const headers = [
      'username',
      'userEmail',
      'entityType',
      'entityName',
      'entityAddress',
      'cuisineType',
      'menuLink',
      'stars',
      'comment',
      'rating',
      'date',
      'status'
    ];

    let csvContent = headers.join(',') + '\n';

    // Генеруємо унікальних користувачів (10% від кількості рядків)
    const usersCount = Math.max(50, Math.floor(rowCount * 0.1));
    const users: Array<{ firstName: string; lastName: string; username: string; email: string }> = [];
    
    for (let i = 0; i < usersCount; i++) {
      const firstName = this.randomElement(this.firstNames);
      const lastName = this.randomElement(this.lastNames);
      users.push({
        firstName,
        lastName,
        username: this.generateUsername(firstName, lastName),
        email: this.generateEmail(firstName, lastName)
      });
    }

    // Генеруємо унікальні заклади
    const restaurants = this.restaurantNames.map(name => ({
      name,
      address: this.generateAddress(),
      cuisineType: this.randomElement(this.cuisineTypes),
      menuLink: `https://menu.example.com/${name.toLowerCase().replace(/\s+/g, '-')}`
    }));

    const hotels = this.hotelNames.map(name => ({
      name,
      address: this.generateAddress(),
      stars: this.random(1, 5)
    }));

    // Генеруємо відгуки
    for (let i = 0; i < rowCount; i++) {
      const user = this.randomElement(users);
      const isRestaurantReview = Math.random() > 0.5;

      let row: string[];

      if (isRestaurantReview) {
        const restaurant = this.randomElement(restaurants);
        row = [
          user.username,
          user.email,
          'restaurant',
          restaurant.name,
          restaurant.address,
          restaurant.cuisineType,
          restaurant.menuLink,
          '', // stars (empty for restaurants)
          this.randomElement(this.comments),
          this.random(1, 5).toString(),
          this.generateDate(),
          this.randomElement(this.statuses)
        ];
      } else {
        const hotel = this.randomElement(hotels);
        row = [
          user.username,
          user.email,
          'hotel',
          hotel.name,
          hotel.address,
          '', // cuisineType (empty for hotels)
          '', // menuLink (empty for hotels)
          hotel.stars.toString(),
          this.randomElement(this.comments),
          this.random(1, 5).toString(),
          this.generateDate(),
          this.randomElement(this.statuses)
        ];
      }

      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    }

    // Створюємо директорію, якщо не існує
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Записуємо файл
    fs.writeFileSync(outputPath, csvContent, 'utf-8');
    console.log(`CSV file generated successfully: ${outputPath}`);
    console.log(`Total rows: ${rowCount}`);
    console.log(`Unique users: ${usersCount}`);
    console.log(`Restaurants: ${restaurants.length}`);
    console.log(`Hotels: ${hotels.length}`);
  }
}

// Запуск генератора
const generator = new CsvGenerator();
const rowCount = parseInt(process.argv[2]) || 1000;
const outputPath = process.argv[3] || path.join(__dirname, '../../data/reviews.csv');

generator.generate(rowCount, outputPath);
