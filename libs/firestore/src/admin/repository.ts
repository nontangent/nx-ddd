import { 
  FirestoreAdapter as _FirestoreAdapter,
  FirestoreRepository,
} from '@nx-ddd/firestore/common';
import * as dayjs from 'dayjs';
import { FirestoreAdapter } from './adapter';

export abstract class AdminFirestoreRepository<
  Entity extends {id: string},
  Data extends object,
> extends FirestoreRepository<Entity, Data, dayjs.Dayjs> {

  constructor(adapter: FirestoreAdapter) { super(adapter); }

  async bulkUpdate(entities: (Partial<Entity>)[]): Promise<void> {
    return entities.reduce((bulkWriter, entity) => {
      const path = this.buildDocPath(entity);
      const doc = this.adapter.doc<Data>(path);
      
      (this.adapter as FirestoreAdapter).bulkWriter();

      bulkWriter.update(doc, {
        // TODO: 型
        ...this.converter.toFirestore(entity as Entity),
        ...this.buildServerTimestampObject(['updatedAt']),
      });
      return bulkWriter;
    }, (this.adapter as FirestoreAdapter).bulkWriter()).close();
  }
}
