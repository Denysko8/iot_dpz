export interface IDataImportService {
  importFromCsv(filePath: string): Promise<void>;
}
