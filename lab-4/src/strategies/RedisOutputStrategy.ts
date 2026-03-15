import { createClient } from 'redis';
import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { DataRecord } from '../types/DataRecord';

interface RedisConfig {
  url: string;
  key: string;
}

export class RedisOutputStrategy implements IOutputStrategy<DataRecord> {
  constructor(private readonly config: RedisConfig) {}

  async write(records: DataRecord[]): Promise<void> {
    const client = createClient({ url: this.config.url });

    await client.connect();

    try {
      if (records.length > 0) {
        await client.rPush(
          this.config.key,
          records.map((record) => JSON.stringify(record))
        );
      }

      console.log(`Pushed ${records.length} records to Redis list ${this.config.key}`);
    } finally {
      await client.disconnect();
    }
  }
}
