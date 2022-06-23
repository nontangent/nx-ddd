import { Observable } from 'rxjs';

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

// Memo(nontangent): FirestoreのData型に変換する
export type ToFirestoreData<Entity, Date> = {
  [K in keyof Entity]: Entity[K] extends Date ? Timestamp | FieldValue : Entity[K];
};

export interface DocumentReference<DocumentData, OriginalReference = any> {
  __ref?: OriginalReference,
  set(data: DocumentData, options?: any): Promise<void | any>;
  get(): Promise<DocumentSnapshot<DocumentData>>;
  update(data: DocumentData): Promise<void | any>;
  delete(): Promise<void | any>;
  stateChanges?: () => Observable<DocumentSnapshot<DocumentData>>;
}

export type FirestoreDocument<DocumentData> = DocumentReference<DocumentData>;

export interface FirestoreCollection<DocumentData, RawFirestoreCollection = any> {
  __ref?: RawFirestoreCollection,
  stateChanges?: () => Observable<DocumentChangeAction<DocumentData>[]>;
  get(options?: GetOptions): Promise<QuerySnapshot<DocumentData>>;
}

export interface FirestoreCollectionGroup<DocumentData> {
  __ref?: any,
  stateChanges?: () => Observable<DocumentChangeAction<DocumentData>[]>;
  get(options?: GetOptions): Promise<QuerySnapshot<DocumentData>>;
}