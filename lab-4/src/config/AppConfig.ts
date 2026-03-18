import { readFile } from 'fs/promises';
import * as path from 'path';

export type OutputStrategyName = 'console' | 'file' | 'kafka' | 'redis';

interface ConsoleConfig {
  pretty: boolean;
}

interface FileConfig {
  outputPath: string;
}

interface KafkaConfig {
  brokers: string[];
  clientId: string;
  topic: string;
}

interface RedisConfig {
  url: string;
  key: string;
}

export interface AppConfig {
  input: {
    type: 'xlsx';
    filePath: string;
  };
  output: {
    strategy: OutputStrategyName;
    console: ConsoleConfig;
    file: FileConfig;
    kafka: KafkaConfig;
    redis: RedisConfig;
  };
}

export async function loadConfig(configPath?: string): Promise<AppConfig> {
  const defaultPath = './lab-4/config/app.config.json';
  const resolvedPath = path.resolve(process.cwd(), configPath ?? defaultPath);
  const raw = await readFile(resolvedPath, 'utf8');

  return JSON.parse(raw) as AppConfig;
}
