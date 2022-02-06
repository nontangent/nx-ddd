import { CommonFirestoreDocument } from '../common/interfaces';
import { FirestoreAdapter } from '../common/adapters';


export interface BulkWriter<Data> {
  update: (doc: CommonFirestoreDocument<Data>, data : Data) => any;
  close: () => void;
}

export interface AdminFirestoreAdapter<Data> extends FirestoreAdapter {
  bulkWriter: () => BulkWriter<Data>; 
}
