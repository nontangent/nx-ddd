import * as admin from 'firebase-admin';
import * as dayjs from 'dayjs';
import { CommonFirestoreRepository } from '../common/repository';
import { FirestoreFieldsAdapter } from '../common/adapters';
import { FirestoreDayJsAdapter as _FirestoreDayJsAdapter} from '../dayjs';
import { AdminFirestoreAdapter as IAdminFirestoreAdapter } from './interfaces';

import { from, Observable, of } from 'rxjs';
import {
  CommonFirestoreDocument, CommonFirestoreCollection, 
  DocumentSnapshot, QuerySnapshot, DocumentChangeAction, 
  CommonFirestoreCollectionGroup
} from '../common/interfaces';


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

export class FirestoreDayJsAdapter extends _FirestoreDayJsAdapter {
  Timestamp = admin.firestore.Timestamp;
}

export class FieldsFirestoreAdapter implements FirestoreFieldsAdapter {
  FieldValue = admin.firestore.FieldValue;
}

export class AdminFirestoreAdapter<Date> implements IAdminFirestoreAdapter<Date> {
  
  private _firestore;
  setFirestore(firestore) {
    this._firestore = firestore;
  }

  doc<Data>(path: string) {
    return convertDocRef<Data>(this._firestore.doc(path) as any);
  }

  collection<Data>(path: string) {
    return convertCollectionRef<Data>(this._firestore.collection(path) as any);
  }

  collectionGroup<Data>(path: string) {
    return convertCollectionGroupRef<Data>(this._firestore.collectionGroup(path) as any);
  }

  bulkWriter = <Data>() => ({
    update: (doc: CommonFirestoreDocument<Data>, data : Data) => {
      this._firestore.bulkWriter().update(doc.__ref, data)
    },
    close: () => this._firestore.bulkWriter().close(),
  });

}

export abstract class AdminFirestoreRepository<
  Entity extends {id: string},
  Data extends object,
> extends CommonFirestoreRepository<Entity, Data, dayjs.Dayjs> {

  constructor(protected firestore: AdminFirestoreAdapter<Data>) {
    super(firestore, new FieldsFirestoreAdapter(), new FirestoreDayJsAdapter());
  };

  async bulkUpdate(entities: (Partial<Entity>)[]): Promise<void> {
    return entities.reduce((bulkWriter, entity) => {
      const path = this.buildDocPath(entity);
      const doc = this.firestore.doc<Data>(path);
      
      this.firestore.bulkWriter()

      bulkWriter.update(doc, {
        // TODO: 型
        ...this.converter.toFirestore(entity as Entity),
        ...this.buildServerTimestampObject(['updatedAt']),
      });
      return bulkWriter;
    }, this.firestore.bulkWriter()).close();
  }
}
