import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { DataRecord } from '../types/DataRecord';

export class ConsoleOutputStrategy implements IOutputStrategy<DataRecord> {
  constructor(private readonly pretty: boolean) {}

  async write(records: DataRecord[]): Promise<void> {
    for (const record of records) {
      const line = this.pretty
        ? JSON.stringify(record, null, 2)
        : JSON.stringify(record);

      console.log(line);
    }
  }
}
