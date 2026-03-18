import * as xlsx from 'xlsx';
import { IDataReader } from '../interfaces/IDataReader';
import { DataRecord } from '../types/DataRecord';

export class ExcelDataReader implements IDataReader<DataRecord> {
  async read(filePath: string): Promise<DataRecord[]> {
    const workbook = xlsx.readFile(filePath);
    const [firstSheetName] = workbook.SheetNames;

    if (!firstSheetName) {
      throw new Error('XLSX file does not contain any sheets.');
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rows = xlsx.utils.sheet_to_json<DataRecord>(worksheet, {
      defval: null,
      raw: false
    });

    return rows;
  }
}
