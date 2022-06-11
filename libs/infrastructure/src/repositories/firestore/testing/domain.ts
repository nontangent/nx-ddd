import { Entity } from '@nx-ddd/domain/models';
import dayjs from 'dayjs';

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
