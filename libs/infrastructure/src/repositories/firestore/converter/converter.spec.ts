import dayjs from 'dayjs';
import admin from 'firebase-admin';
import { Converter } from './converter';
import { AdminFirestoreAdapter } from '../adapters/admin';
import { DocumentSnapshot } from '../interfaces';
import { Transaction, testTransaction, timestampFactory, initializeTest } from '../testing';

initializeTest();

describe('Converter', () => {
  let converter: Converter;
  const adapter = new AdminFirestoreAdapter(admin.firestore());

  beforeEach(() => {
    converter = new Converter(Transaction, adapter);
  })

  describe('fromFirestore', () => {
    it('should be succeeded', () => {
      const doc: DocumentSnapshot<any> = {
        id: 'test-transaction-0001',
        ref: { path: 'tests/test-transaction-0001' },
        data: () => ({
          dealAt: timestampFactory(dayjs('2018-02-01')),
          createdAt: timestampFactory(dayjs('2022-01-01')),
          updatedAt: timestampFactory(dayjs('2022-01-01')),
        }),
      };

      expect(converter.fromFirestore(doc)).toEqual(testTransaction);
    });
  });

  describe('toFirestore', () => {
    it('should be succeeded', () => {
      expect(converter.toFirestore(testTransaction)).toEqual({
        dealAt: timestampFactory(dayjs('2018-02-01')),
        createdAt: timestampFactory(dayjs('2022-01-01')),
        updatedAt: timestampFactory(dayjs('2022-01-01')),
      });
    });
  });
});
