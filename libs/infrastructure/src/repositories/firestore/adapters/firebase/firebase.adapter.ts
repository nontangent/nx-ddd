import { doc, collection, collectionGroup, FieldValue, Timestamp, setDoc, getDoc, getDocs, getFirestore, onSnapshot, deleteDoc, writeBatch, query, orderBy, limit } from 'firebase/firestore';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { FirestoreAdapter, QueryFn } from '../base';
import { DocumentChangeAction, DocumentSnapshot, FirestoreCollection, FirestoreCollectionGroup, FirestoreDocument } from '../../interfaces';
import { updateDoc } from '@angular/fire/firestore';

export class FirebaseFirestoreAdapter extends FirestoreAdapter<dayjs.Dayjs> {

  constructor(public firestore = getFirestore()) { super() }

  get FieldValue(): typeof FieldValue {
    return FieldValue;  
  }

  get Timestamp(): typeof Timestamp {
    return Timestamp;  
  }

  protected isTimestamp = (v: any): v is Timestamp => v instanceof Timestamp;
  protected isDate = (v: any): v is dayjs.Dayjs => dayjs.isDayjs(v);

  protected convertDateToTimestamp(date: dayjs.Dayjs): Timestamp {
    return Timestamp.fromDate(date.toDate());
  }

  protected convertTimestampToDate(timestamp: Timestamp): dayjs.Dayjs {
    return dayjs(timestamp.toDate())
  }

  doc(path: string): FirestoreDocument<any> {
    const docRef = doc(this.firestore, path);
    return {
      __ref: docRef,
      set: (data) => setDoc(docRef, data),
      get: () => getDoc(docRef),
      update: (data) => updateDoc(docRef, data),
      delete: () => deleteDoc(docRef),
      stateChanges: () => {
        const subject = new Subject<DocumentSnapshot<any>>();
        onSnapshot(docRef, (doc) => subject.next({id: doc.id, ref: doc.ref, data: () => doc.data()}));
        return subject.asObservable();
      },
    }
  }

  collection(path: string): FirestoreCollection<any> {
    const ref = collection(this.firestore, path);
    return {
      __ref: ref,
      stateChanges: () => {
        const subject = new Subject<DocumentChangeAction<any>[]>();
        onSnapshot(ref, (snapshot) => subject.next(snapshot.docChanges().map(change => ({
          type: change.type, payload: {doc: change.doc},
        }))));
        return subject.asObservable();
      },
      get: () => getDocs(ref),
    }
  }

  collectionGroup(collectionId: string): FirestoreCollectionGroup<any> {
    const ref = collectionGroup(this.firestore, collectionId);
    return  {
      __ref: ref,
      stateChanges: () => {
        const subject = new Subject<DocumentChangeAction<any>[]>();
        onSnapshot(ref, (snapshot) => subject.next(snapshot.docChanges().map(change => ({
          type: change.type, payload: {doc: change.doc},
        }))));
        return subject.asObservable();
      },
      get: () => getDocs(ref),
    }
  }

  runTransaction() {
    return 
  }

  query<Data>(collection: FirestoreCollection<Data>, ...queryFnArray: QueryFn<Data>[]): any {
    return query(collection.__ref, ...queryFnArray.map(queryFn => queryFn()));
  }

  orderBy<Data>(key: string, order: 'asc' | 'desc' = 'asc'): QueryFn<Data> {
    return () => orderBy(key, order);
  }

  limit<Data>(n: number): QueryFn<Data> {
    return () => limit(n);
  }

  batch() {
    return writeBatch(this.firestore);
  }
}