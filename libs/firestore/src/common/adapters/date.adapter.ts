import { FirestoreData, Timestamp, TimestampConstructor } from "../interfaces";

export abstract class BaseFirestoreDateAdapter<D> {
  abstract Timestamp: TimestampConstructor;
  abstract fromTimestampToDate(timestamp: Timestamp): D;
  abstract fromDateToTimestamp(date: D): Timestamp;
  protected abstract isDate(v: any): v is D;
  
  protected isTimestamp(v: any): v is Timestamp {
    const res = v instanceof this.Timestamp;
    return res;
  };

  toFirestore<T>(data: T): FirestoreData<T, D> {
    return Object.entries(data).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isDate(v) ? this.fromDateToTimestamp(v) : v,
    }), {} as FirestoreData<T, D>);
  }

  fromFirestore<T>(data: FirestoreData<T, D>): T {
    return Object.entries(data).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isTimestamp(v) ? this.fromTimestampToDate(v) : v,
    }), {} as T);
  } 
}

export abstract class FirestoreDateAdapter extends BaseFirestoreDateAdapter<Date> {
  protected isDate(v: any): v is Date {
    return v instanceof Date;
  }

  fromTimestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
  }

  fromDateToTimestamp(date: Date): Timestamp {
    return this.Timestamp.fromDate(date);
  }
}
