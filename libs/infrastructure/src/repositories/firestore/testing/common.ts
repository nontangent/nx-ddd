import admin from 'firebase-admin';
import dayjs from 'dayjs';
import { AdminFirestoreAdapter } from '../adapters/admin';

export const testAdapterFactory = () => new AdminFirestoreAdapter(admin.firestore());

export const timestampFactory = (dt: dayjs.Dayjs) => {
  return admin.firestore.Timestamp.fromDate(dt.toDate());
};

export function initializeTest(projectId: string = 'nx-ddd') {
  process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
  admin.initializeApp({projectId});
  return testAdapterFactory();
}
