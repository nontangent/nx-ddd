import { Observable } from "rxjs";

export interface GetOptions {
  readonly source?: 'default' | 'server' | 'cache';
}

export interface DocumentChangeAction<T> {
  type: any;
  payload: {doc: DocumentSnapshot<T>};
}

export interface DocumentSnapshot<T> {
  id: string;
  ref: { path: string; };
  data: () => T;
}

export interface QuerySnapshot<T> {
  docs: DocumentSnapshot<T>[];
};

export interface Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
  toMillis(): number;
  isEqual(other: Timestamp): boolean;
  valueOf(): string;
}

export interface TimestampConstructor {
  new (seconds: number, nanoseconds: number): Timestamp;
  now(): Timestamp;
  fromDate(date: Date): Timestamp;
  fromMillis(milliseconds: number): Timestamp;
}

// TODO(nontangent): 実装
export type FieldValue = any;

export type FirestoreData<T, D> = {[K in keyof T]: T[K] extends D ? Timestamp | FieldValue : T[K]};

export interface CommonFirestoreDocument<Data> {
  __ref?: any,
  set(data: Data, options?: any): Promise<void>;
  get(): Observable<DocumentSnapshot<Data>>;
}

export interface CommonFirestoreCollection<Data> {
  stateChanges(): Observable<DocumentChangeAction<Data>[]>;
  get(options?: GetOptions): Observable<QuerySnapshot<Data>>;
}

export interface CommonFirestoreCollectionGroup<Data> {
  stateChanges(): Observable<DocumentChangeAction<Data>[]>;
  get(options?: GetOptions): Observable<QuerySnapshot<Data>>;
}