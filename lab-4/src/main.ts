import * as path from 'path';
import { loadConfig } from './config/AppConfig';
import { ExcelDataReader } from './readers/ExcelDataReader';
import { OutputStrategyFactory } from './factories/OutputStrategyFactory';

async function main(): Promise<void> {
  try {
    const configPathFromArgs = process.argv[2];
    const config = await loadConfig(configPathFromArgs);

    const inputPath = path.resolve(process.cwd(), config.input.filePath);

    const reader = new ExcelDataReader();
    const outputStrategy = OutputStrategyFactory.create(config);

    const records = await reader.read(inputPath);
    console.log(`Read ${records.length} records from ${inputPath}`);

    await outputStrategy.write(records);
    console.log('Lab-4 pipeline completed successfully.');
  } catch (error) {
    console.error('Lab-4 pipeline failed:', error);
    process.exit(1);
  }
}

void main();
