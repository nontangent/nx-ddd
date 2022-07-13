import { Injectable, Inject, InjectionToken } from '@nx-ddd/core';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export const SERVICE_ACCOUNT = new InjectionToken('[@nx-ddd/infrastructure/google-sheet/client] Service Account');

@Injectable()
export class GoogleSheetClient {

  constructor(
    @Inject(SERVICE_ACCOUNT) private serviceAccount: any,
  ) { }

  private async getDoc(id: string) {
    const doc = new GoogleSpreadsheet(id);
    await doc.useServiceAccountAuth(this.serviceAccount);
    await doc.loadInfo();
    return doc;
  }

  async writeSheet(sheetId: string, sheetName, data: {[key: string]: string | number | boolean}[]) {
    const doc = await this.getDoc(sheetId);
    const sheet = doc.sheetsByTitle[sheetName];
    await sheet.clear();
    if (!data.length) return;
    await sheet.setHeaderRow(Object.keys(data[0]));
    await sheet.addRows(data, {raw: false, insert: false});
  }

  async readSheet(sheetId: string, sheetName: string) {
    const doc = await this.getDoc(sheetId);
    const sheet = doc.sheetsByTitle[sheetName];
    return sheet.getRows();
  }
}
