import { Injectable, NgModule } from '@angular/core';
import { 
  doc, collection, collectionGroup, serverTimestamp, 
  Timestamp, setDoc, getDoc, deleteDoc, getDocs, 
  onSnapshot, updateDoc, Firestore, runTransaction, writeBatch
} from '@angular/fire/firestore';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { FirestoreAdapter } from '../base';
import { DocumentChangeAction, FirestoreCollection, FirestoreCollectionGroup, FirestoreDocument } from '../../interfaces';


@Injectable()
export class AngularFireFirestoreAdapter extends FirestoreAdapter<dayjs.Dayjs> {

  constructor(public firestore: Firestore) { super() }

  get FieldValue() {
    return {serverTimestamp};  
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

  runTransaction(fn: Parameters<typeof runTransaction>[1]) {
    return runTransaction(this.firestore, fn);
  }
  
  batch() {
    return writeBatch(this.firestore);
  }
}

@NgModule({
  providers: [{ provide: AngularFireFirestoreAdapter, useClass: AngularFireFirestoreAdapter }],
})
export class NxDDDFirestoreAdapterModule {}