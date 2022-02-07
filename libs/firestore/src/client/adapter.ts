import { FirestoreAdapter as _FirestoreAdapter, Timestamp } from '@nx-ddd/firestore/common';
import * as dayjs from 'dayjs';
import firebase from 'firebase';


export class FirestoreAdapter extends _FirestoreAdapter<dayjs.Dayjs> {
  
  constructor(
    firestoreInstance: firebase.firestore.Firestore,
    firestore: any,
  ) {
    super(firestoreInstance, firestore);
  };

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
    return this.firestoreInstance.doc(path);
  }

  collection<Data>(path: string) {
    return this.firestoreInstance.collection(path);
  }

  collectionGroup<Data>(path: string) {
    return this.firestoreInstance.collectionGroup(path);
  }

}

export function createFirestoreAdapter(
  firestoreInstance: firebase.firestore.Firestore,
  firestore: any,
) {
  return new FirestoreAdapter(firestoreInstance, firestore);
}
