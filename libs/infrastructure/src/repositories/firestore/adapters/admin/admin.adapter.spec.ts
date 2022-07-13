import admin from 'firebase-admin';
import dayjs from 'dayjs';
import { AdminFirestoreAdapter } from './admin.adapter';

process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
admin.initializeApp({projectId: 'nx-ddd'});

describe('AdminFirestoreAdapter', () => {
  let adapter: AdminFirestoreAdapter;

  beforeEach(() => {
    adapter = new AdminFirestoreAdapter(admin.firestore());
  });

  describe('CRUD', () => {
    it('should be succeeded', async () => {
      const path = `examples/0001`;
      await adapter.doc(path).set({hoge: 'fuga'});
      expect((await adapter.doc(path).get()).data()).toEqual({hoge: 'fuga'});

      await adapter.doc(path).update({hoge: 'poga'});
      expect((await adapter.doc(path).get()).data()).toEqual({hoge: 'poga'});

      await adapter.doc(path).delete();
      expect((await adapter.doc(path).get()).data()).toEqual(undefined);
    });
  });

  describe('toFirestoreData()', () => {
    it('should be succeeded', () => {
      const data = adapter.toFirestoreData({createdAt: dayjs()});
      expect(data.createdAt).toBeInstanceOf(admin.firestore.Timestamp);
    });
  });

  
});