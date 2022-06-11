import { Dayjs } from 'dayjs';
import pick from 'lodash.pick';
import { FirestoreAdapter } from '../adapters';
import { DocumentSnapshot, ToFirestoreData } from '../interfaces';

export class Converter<Entity = any, Data = ToFirestoreData<Entity, Dayjs>> {
  constructor (
    protected Entity: any,
    private adapter: FirestoreAdapter<any>,
  ) { }

  private get fields(): string[] {
    return this.Entity.FIELDS;
  }

  fromFirestore<Data>(doc: DocumentSnapshot<Data>): Entity {
    return this.fromFirestoreData({...doc.data(), id: doc.id});
  }

  protected fromFirestoreData<Data>(data: Data): Entity {
    return this.Entity.fromObj(this.adapter.fromFirestoreData({...data}));
  }

  toFirestore<Entity>(entity: Entity): Data {
    const data = this.adapter.toFirestoreData<Entity>(this.Entity.toObj(entity));
    return pick(data, this.fields) as Data;
  }
}
