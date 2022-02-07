import { 
  CommonFirestoreDocument, 
  CommonFirestoreCollection, 
  CommonFirestoreCollectionGroup, 
  DocumentSnapshot,
  DocumentChangeAction, 
  FirestoreAdapter as _FirestoreAdapter,
  Timestamp,
  QuerySnapshot,
} from '@nx-ddd/firestore/common';
import * as dayjs from 'dayjs';
import { from, Observable, of } from 'rxjs';
import { firestore } from 'firebase-admin';


export const convertDocRef = <Data>(
  docRef: FirebaseFirestore.DocumentReference<Data>
): CommonFirestoreDocument<Data> => {
  return {
    __ref: docRef,
    set: (data: Data, options?: any): Promise<void> => {
      return docRef.set(data, options).then(() => {});
    },
    get: (): Observable<DocumentSnapshot<Data>> => from(docRef.get())
  }
}

export const convertCollectionRef = <Data>(
  collectionRef: FirebaseFirestore.CollectionReference<Data>
): CommonFirestoreCollection<Data> => {
  return {
    stateChanges: (): Observable<DocumentChangeAction<Data>[]> => of(),
    get: (): Observable<QuerySnapshot<Data>> => from(collectionRef.get()),
  }
}

export const convertCollectionGroupRef = <Data>(
  collectionRef: FirebaseFirestore.CollectionGroup<Data>
): CommonFirestoreCollectionGroup<Data> => {
  return {
    stateChanges: (): Observable<DocumentChangeAction<Data>[]> => of(),
    get: (): Observable<QuerySnapshot<Data>> => from(collectionRef.get()),
  }
}

export class FirestoreAdapter extends _FirestoreAdapter<dayjs.Dayjs> {
  
  constructor(
    firestoreInstance: firestore.Firestore,
    firestore: any,
  ) {
    super(firestoreInstance, firestore);
  }

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
    return convertDocRef<Data>(this.firestoreInstance.doc(path) as any);
  }

  collection = <Data>(path: string) => {
    return convertCollectionRef<Data>(this.firestoreInstance.collection(path) as any);
  }

  collectionGroup<Data>(path: string) {
    return convertCollectionGroupRef<Data>(this.firestoreInstance.collectionGroup(path) as any);
  }

  bulkWriter = <Data>() => ({
    update: (doc: CommonFirestoreDocument<Data>, data : Data) => {
      this.firestoreInstance.bulkWriter().update(doc.__ref, data)
    },
    close: () => this.firestoreInstance.bulkWriter().close(),
  });

}

export function createFirestoreAdapter(
  firestoreInstance: firestore.Firestore,
  firestore: any,
) {
  return new FirestoreAdapter(firestoreInstance, firestore);
}
