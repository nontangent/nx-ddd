import { Entity } from '@nx-ddd/domain/models';
import dayjs from 'dayjs';
import admin from 'firebase-admin';
import { AdminFirestoreAdapter } from '../adapters/admin';
import { Firestore, FirestoreRepository } from '../repository';

export const testAdapterFactory = () => new AdminFirestoreAdapter(admin.firestore());

export const timestampFactory = (dt: dayjs.Dayjs) => {
  return admin.firestore.Timestamp.fromDate(dt.toDate());
};

export function initializeTest(projectId: string = 'nx-ddd') {
  process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
  admin.initializeApp({projectId});
  return testAdapterFactory();
}

export class Transaction extends Entity {
  dealAt: dayjs.Dayjs;

  static readonly FIELDS = ['dealAt', 'createdAt', 'updatedAt'];
}

export class UserTransaction extends Transaction {
  userId: string;

  static readonly FIELDS = ['dealAt', 'createdAt', 'updatedAt'];
}

export const testTransaction = Transaction.fromObj({
  id: 'test-transaction-0001',
  dealAt: dayjs('2018-02-01'),
  createdAt: dayjs('2022-01-01'),
  updatedAt: dayjs('2022-01-01'),
});

export const testUserTransaction = Transaction.fromObj({
  ...testTransaction,
  userId: 'test-user-0001',
});

@Firestore({Entity: Transaction})
export class TransactionRepository extends FirestoreRepository<Transaction> { }

@Firestore({
  Entity: UserTransaction,
  path: `users/:userId/transactions`,
})
export class UserTransactionRepository extends FirestoreRepository<UserTransaction> { }

