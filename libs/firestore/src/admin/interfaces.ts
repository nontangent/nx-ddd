import { CommonFirestoreDocument, FirestoreAdapter } from '@nx-ddd/firestore/common';

export interface BulkWriter<Data> {
  update: (doc: CommonFirestoreDocument<Data>, data : Data) => any;
  close: () => void;
}

export interface AdminFirestoreAdapter<Data> extends FirestoreAdapter<Date> {
  bulkWriter: () => BulkWriter<Data>; 
}
