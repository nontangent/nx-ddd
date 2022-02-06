import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { from, Observable, of } from 'rxjs';
import {
  CommonFirestoreDocument, CommonFirestoreCollection, 
  DocumentSnapshot, QuerySnapshot, DocumentChangeAction, 
  CommonFirestoreCollectionGroup
} from '../common/interfaces';
import { AdminFirestoreAdapter } from '../admin/interfaces';


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

export class NestFirestoreAdapter<Data> implements AdminFirestoreAdapter<Data> {
  constructor(public nestFire: FirebaseFirestoreService) { }

  doc = <Data>(path: string) => convertDocRef<Data>(this.nestFire.doc(path) as any);
  collection = <Data>(path: string) => convertCollectionRef<Data>(this.nestFire.collection(path) as any);
  collectionGroup = <Data>(path: string) => convertCollectionGroupRef<Data>(this.nestFire.collectionGroup(path) as any);
  bulkWriter = () => ({
    update: (doc: CommonFirestoreDocument<Data>, data : Data) => {
      this.nestFire.bulkWriter().update(doc.__ref, data)
    },
    close: () => this.nestFire.bulkWriter().close(),
  });
}