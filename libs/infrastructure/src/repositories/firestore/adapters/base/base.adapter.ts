import {
  FirestoreCollection, FirestoreCollectionGroup, FirestoreDocument,
  ToFirestoreData, Timestamp
} from '../../interfaces';

export type QueryFn<Data> = (collection?: any) => any;

export abstract class FirestoreAdapter<Date = any> {
  protected abstract isTimestamp: (v: any) => v is Timestamp;
  protected abstract isDate(v: any): v is Date;
  protected abstract convertTimestampToDate(timestamp: Timestamp): Date;
  protected abstract convertDateToTimestamp(date: Date): Timestamp;

  abstract get Timestamp(): any
  abstract get FieldValue(): any

  abstract doc<Data>(path: string): FirestoreDocument<Data>;
  abstract collection<Data>(path: string): FirestoreCollection<Data>;
  abstract collectionGroup<Data>(collectionId: string): FirestoreCollectionGroup<Data>;
  abstract runTransaction(fn: any): any;
  abstract batch(): any;

  abstract query<Data>(collection: FirestoreCollection<Data>, ...queryFnArray: QueryFn<Data>[]): any;
  abstract orderBy<Data>(key: string, order: 'asc' | 'desc'): QueryFn<Data>;
  abstract limit<Data>(n: number): QueryFn<Data>;

  toFirestoreData<Entity>(entity: Entity): ToFirestoreData<Entity, Date> {
    return Object.entries(entity).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isDate(v) ?  this.convertDateToTimestamp(v) : v,
    }), {} as ToFirestoreData<Entity, Date>);
  }

  fromFirestoreData<Entity>(data: ToFirestoreData<Entity, Date>): Entity {
    return Object.entries(data).reduce((pre, [k, v]) => ({
      ...pre, [k]: this.isTimestamp(v) ? this.convertTimestampToDate(v) : v,
    }), {} as Entity);
  }

}
