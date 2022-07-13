import { Dayjs } from 'dayjs';
import { Optional, Injectable, Inject, InjectionToken } from '@nx-ddd/core';
import pick from 'lodash.pick';
import { FirestoreAdapter } from '../adapters';
import { DocumentSnapshot, ToFirestoreData } from '../interfaces';

export const ENTITY = new InjectionToken('[@nx-ddd/infrastructure] ENTITY');

@Injectable()
export class FirestoreConverter<Entity = any, Data = ToFirestoreData<Entity, Dayjs>> {

  constructor (
    @Optional() @Inject(ENTITY) protected Entity: any,
    protected adapter: FirestoreAdapter<any>,
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

// DEPRECATED(nontangent): use FirestoreConverter
@Injectable()
export class Converter<
  Entity = any,
  Data = ToFirestoreData<Entity, Dayjs>
> extends FirestoreConverter<Entity, Data> { }
