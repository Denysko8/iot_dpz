export interface CsvRow {
  [key: string]: string;
}

export interface ICsvReader {
  readCsv(filePath: string): Promise<CsvRow[]>;
}
