import { FirestoreRepository as _FirestoreRepository } from '@nx-ddd/firestore/common';
import { FirestoreAdapter } from './adapter';
import * as dayjs from 'dayjs';

export abstract class FirestoreRepository<
  Entity extends {id: string},
  Data extends object,
> extends _FirestoreRepository<Entity, Data, dayjs.Dayjs> {
  constructor(adapter: FirestoreAdapter) { super(adapter); }
}
