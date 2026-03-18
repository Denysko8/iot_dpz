import { Kafka, Partitioners } from 'kafkajs';
import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { DataRecord } from '../types/DataRecord';

interface KafkaConfig {
  brokers: string[];
  clientId: string;
  topic: string;
}

export class KafkaOutputStrategy implements IOutputStrategy<DataRecord> {
  constructor(private readonly config: KafkaConfig) {}

  async write(records: DataRecord[]): Promise<void> {
    const kafka = new Kafka({
      brokers: this.config.brokers,
      clientId: this.config.clientId
    });

    process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

    const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
    });

    await producer.connect();

    try {
      await producer.send({
        topic: this.config.topic,
        messages: records.map((record) => ({
          value: JSON.stringify(record)
        }))
      });

      console.log(`Published ${records.length} records to Kafka topic ${this.config.topic}`);
    } finally {
      await producer.disconnect();
    }
  }
  
}
