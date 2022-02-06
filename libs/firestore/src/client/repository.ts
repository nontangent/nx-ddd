import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { Dayjs } from 'dayjs';
import { CommonFirestoreRepository } from '../common/repository';
import { FirestoreFieldsAdapter } from '../common/adapters';
import { FirestoreDayJsAdapter as _FirestoreDayJsAdapter } from '../dayjs';

export class FirestoreDayJsAdapter extends _FirestoreDayJsAdapter {
  Timestamp = firebase.firestore.Timestamp;
}

export class FieldsFirestoreAdapter implements FirestoreFieldsAdapter {
  FieldValue = firebase.firestore.FieldValue;
}


export abstract class FirestoreRepository<
  Firestore extends AngularFirestore, 
  Entity extends {id: string},
  Data extends object,
> extends CommonFirestoreRepository<Entity, Data, Dayjs> {

  constructor(protected firestore: Firestore) {
    super(
      firestore,
      new FieldsFirestoreAdapter(),
      new FirestoreDayJsAdapter(),
    );
  }
}
