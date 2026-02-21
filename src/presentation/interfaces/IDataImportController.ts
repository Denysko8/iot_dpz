export interface IDataImportController {
  importData(filePath: string): Promise<void>;
}
