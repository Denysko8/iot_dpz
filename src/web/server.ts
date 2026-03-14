import 'reflect-metadata';
import { AppDataSource } from '../dal/dataSource';
import { createApp } from './app';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    const app = createApp(AppDataSource);
    app.listen(PORT, () => {
      console.log(`Hotel Review System running at http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });
