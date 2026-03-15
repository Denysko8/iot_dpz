export interface IDataReader<T> {
  read(filePath: string): Promise<T[]>;
}
