import { injectable } from 'tsyringe';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { ICsvReader, CsvRow } from '../interfaces/ICsvReader';

@injectable()
export class CsvReader implements ICsvReader {
  async readCsv(filePath: string): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
      const results: CsvRow[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data: CsvRow) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error: Error) => reject(error));
    });
  }
}
