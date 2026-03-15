export interface IOutputStrategy<T> {
  write(records: T[]): Promise<void>;
}
