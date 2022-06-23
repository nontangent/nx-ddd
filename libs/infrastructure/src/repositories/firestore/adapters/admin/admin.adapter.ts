import dayjs from 'dayjs';
import { firestore } from 'firebase-admin';
import { DocumentReference, FirestoreCollection, FirestoreCollectionGroup } from '../../interfaces'
import { FirestoreAdapter, QueryFn } from '../base';

export class AdminFirestoreAdapter extends FirestoreAdapter<dayjs.Dayjs> {

  constructor(private firestore = firestore()) { super() }

  get FieldValue(): typeof firestore.FieldValue {
    return firestore.FieldValue;  
  }

  get Timestamp(): typeof firestore.Timestamp {
    return firestore.Timestamp;  
  }

  protected isTimestamp = (v: any): v is firestore.Timestamp => v instanceof this.Timestamp;
  protected isDate = (v: any): v is dayjs.Dayjs => dayjs.isDayjs(v);

  protected convertDateToTimestamp(date: dayjs.Dayjs): firestore.Timestamp {
    return firestore.Timestamp.fromDate(date.toDate());
  }

  protected convertTimestampToDate(timestamp: firestore.Timestamp): dayjs.Dayjs {
    return dayjs(timestamp.toDate())
  }

  doc(path: string): DocumentReference<any, firestore.DocumentReference> {
    const docRef = this.firestore.doc(path);
    return {
      __ref: docRef,
      set: (data, options?) => docRef.set(data, options),
      get: () => docRef.get(),
      update: (data) => docRef.update(data),
      delete: () => docRef.delete(),
    };
  }

  collection(path: string): FirestoreCollection<any, firestore.CollectionReference> {
    return this.firestore.collection(path);
  }

  collectionGroup(collectionId: string): FirestoreCollectionGroup<any> {
    return this.firestore.collectionGroup(collectionId);
  }
  
  runTransaction(fn: any) {
    return this.firestore.runTransaction(fn);
  }

  query<Data>(collection: FirestoreCollection<Data>, ...queryFnArray: QueryFn<Data>[]): any {
    return queryFnArray.reduce((collectionOrQuery, queryFn) => queryFn(collectionOrQuery), collection);
  }

  orderBy<Data>(key: string, order: 'asc' | 'desc' = 'asc'): QueryFn<Data> {
    return (collection: firestore.CollectionReference<Data> | firestore.Query<Data>) => collection.orderBy(key, order);
  }

  limit<Data>(n: number): QueryFn<Data> {
    return (collection: firestore.CollectionReference<Data> | firestore.Query<Data>) => collection.limit(n);
  }

  batch() {
    return this.firestore.batch();
  }
}