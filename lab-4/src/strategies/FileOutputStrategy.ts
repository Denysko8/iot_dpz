import * as path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { DataRecord } from '../types/DataRecord';

export class FileOutputStrategy implements IOutputStrategy<DataRecord> {
  constructor(private readonly outputPath: string) {}

  async write(records: DataRecord[]): Promise<void> {
    const absolutePath = path.resolve(process.cwd(), this.outputPath);
    await mkdir(path.dirname(absolutePath), { recursive: true });

    const payload = records.map((record) => JSON.stringify(record)).join('\n');
    await writeFile(absolutePath, `${payload}\n`, 'utf8');

    console.log(`Saved ${records.length} records to ${absolutePath}`);
  }
}
