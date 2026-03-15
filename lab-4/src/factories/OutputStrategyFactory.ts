import { IOutputStrategy } from '../interfaces/IOutputStrategy';
import { DataRecord } from '../types/DataRecord';
import { AppConfig } from '../config/AppConfig';
import { ConsoleOutputStrategy } from '../strategies/ConsoleOutputStrategy';
import { FileOutputStrategy } from '../strategies/FileOutputStrategy';
import { KafkaOutputStrategy } from '../strategies/KafkaOutputStrategy';
import { RedisOutputStrategy } from '../strategies/RedisOutputStrategy';

export class OutputStrategyFactory {
  static create(config: AppConfig): IOutputStrategy<DataRecord> {
    const strategyName = config.output.strategy;

    switch (strategyName) {
      case 'console':
        return new ConsoleOutputStrategy(config.output.console.pretty);
      case 'file':
        return new FileOutputStrategy(config.output.file.outputPath);
      case 'kafka':
        return new KafkaOutputStrategy(config.output.kafka);
      case 'redis':
        return new RedisOutputStrategy(config.output.redis);
      default:
        throw new Error(`Unsupported output strategy: ${String(strategyName)}`);
    }
  }
}
