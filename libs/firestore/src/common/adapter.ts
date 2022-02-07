import {
  CommonFirestoreCollection, 
  CommonFirestoreCollectionGroup, 
  CommonFirestoreDocument,
  FirestoreData,
  Timestamp,
} from "./interfaces";

export abstract class FirestoreAdapter<Date> {
  constructor (
    protected firestoreInstance,
    protected _firestore,
  ) { }

  get Timestamp() {
    return this._firestore.Timestamp;
  }

  get FieldValue() {
    return this._firestore.FieldValue;
  }


  abstract doc<Data>(path: string): CommonFirestoreDocument<Data>;
  abstract collection<Data>(path: string): CommonFirestoreCollection<Data>;
  abstract collectionGroup<Data>(path: string): CommonFirestoreCollectionGroup<Data>;

  toFirestore<T>(data: T): FirestoreData<T, Date> {
    return Object.entries(data).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isDate(v) ? this.convertDateToTimestamp(v) : v,
    }), {} as FirestoreData<T, Date>);
  }

  fromFirestore<T>(data: FirestoreData<T, Date>): T {
    return Object.entries(data).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isTimestamp(v) ? this.convertTimestampToDate(v) : v,
    }), {} as T);
  }

  protected isTimestamp = (v: any): v is Timestamp => v instanceof this.Timestamp;
  protected abstract isDate(v: any): v is Date;

  protected abstract convertTimestampToDate(timestamp: Timestamp): Date;
  protected abstract convertDateToTimestamp(date: Date): Timestamp;

}
