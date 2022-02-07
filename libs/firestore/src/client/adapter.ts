import { FirestoreAdapter as _FirestoreAdapter, Timestamp } from '@nx-ddd/firestore/common';
import * as dayjs from 'dayjs';
import firebase from 'firebase';


export class FirestoreAdapter extends _FirestoreAdapter<dayjs.Dayjs> {
  
  constructor(_firestore: firebase.firestore.Firestore) { super(_firestore) };

  protected isDate(v: any): v is dayjs.Dayjs {
    return dayjs.isDayjs(v);
  }

  protected convertTimestampToDate(timestamp: Timestamp): dayjs.Dayjs {
    return dayjs(timestamp.toDate());
  }

  protected convertDateToTimestamp(date: dayjs.Dayjs): Timestamp {
    return this.Timestamp.fromDate(date.toDate());
  }

  doc<Data>(path: string) {
    return this._firestore.doc(path);
  }

  collection<Data>(path: string) {
    return this._firestore.collection(path);
  }

  collectionGroup<Data>(path: string) {
    return this._firestore.collectionGroup(path);
  }

}

export function createFirestoreAdapter(firestore: firebase.firestore.Firestore) {
  return new FirestoreAdapter(firestore);
}
