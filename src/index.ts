import 'reflect-metadata';
import * as path from 'path';
import { configureDependencies, container } from './config/container';
import { IDataImportService } from './bll/interfaces/IDataImportService';

async function main() {
  try {
    console.log('=== IoT Lab 2: Data Import Application ===\n');

    // Налаштування DI контейнера та ініціалізація бази даних
    await configureDependencies();

    // Отримуємо сервіс імпорту даних через DI контейнер
    const dataImportService = container.resolve<IDataImportService>('IDataImportService');

    // Шлях до CSV файлу
    const csvFilePath = process.argv[2] || path.join(__dirname, '../data/reviews.csv');

    console.log(`\nImporting data from: ${csvFilePath}\n`);

    // Імпортуємо дані
    await dataImportService.importFromCsv(csvFilePath);

    console.log('\n=== Import completed successfully! ===');
    process.exit(0);
  } catch (error) {
    console.error('Error during data import:', error);
    process.exit(1);
  }
}

main();
