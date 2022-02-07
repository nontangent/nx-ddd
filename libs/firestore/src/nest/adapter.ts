import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import {
  CommonFirestoreDocument,
  CommonFirestoreCollection, 
  CommonFirestoreCollectionGroup,
  DocumentSnapshot,
  DocumentChangeAction, 
  QuerySnapshot,
  FirestoreAdapter as _FirestoreAdapter,
  Timestamp,
} from '@nx-ddd/firestore/common';
import * as dayjs from 'dayjs';
import { from, Observable, of } from 'rxjs';


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

export class FirestoreAdapter<Data> extends _FirestoreAdapter<dayjs.Dayjs> {

  constructor(
    public nestFire: FirebaseFirestoreService,
    firestore: any
  ) {
    super(nestFire.firestore, firestore);
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
    return convertDocRef<Data>(this.nestFire.doc(path) as any);
  }
  
  collection<Data>(path: string) {
    return convertCollectionRef<Data>(this.nestFire.collection(path) as any);
  }
  
  collectionGroup<Data>(path: string) {
    return convertCollectionGroupRef<Data>(this.nestFire.collectionGroup(path) as any);
  }

  bulkWriter = () => ({
    update: (doc: CommonFirestoreDocument<Data>, data : Data) => {
      this.nestFire.bulkWriter().update(doc.__ref, data)
    },
    close: () => this.nestFire.bulkWriter().close(),
  });
}

export function createFirestoreAdapter(
  nestFire: FirebaseFirestoreService,
  firestore: any,
) {
  return new FirestoreAdapter(nestFire, firestore);
}
