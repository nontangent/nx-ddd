import * as dayjs from 'dayjs';
import { CommonFirestoreRepository } from '../common/repository';
import { FirestoreDayJsAdapter as _FirestoreDayJsAdapter} from '../dayjs';
import { AdminFirestoreAdapter } from '../admin/interfaces';
import { FieldsFirestoreAdapter, FirestoreDayJsAdapter } from '../admin';

export abstract class AdminFirestoreRepository<
  Entity extends {id: string},
  Data extends object,
> extends CommonFirestoreRepository<Entity, Data, dayjs.Dayjs> {

  constructor(protected firestore: AdminFirestoreAdapter<Data>) {
    super(firestore, new FieldsFirestoreAdapter(), new FirestoreDayJsAdapter());
  };

  async bulkUpdate(entities: (Partial<Entity>)[]): Promise<void> {
    return entities.reduce((bulkWriter, entity) => {
      const path = this.buildDocPath(entity);
      const doc = this.firestore.doc<Data>(path);

      
      this.firestore.bulkWriter()


      bulkWriter.update(doc, {
        // TODO: 型
        ...this.converter.toFirestore(entity as Entity),
        ...this.buildServerTimestampObject(['updatedAt']),
      });
      return bulkWriter;
    }, this.firestore.bulkWriter()).close();
  }
}