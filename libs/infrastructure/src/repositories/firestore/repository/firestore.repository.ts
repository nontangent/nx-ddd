import { toObject, generateId } from '@nx-ddd/common/utilities';
import dayjs from 'dayjs';
import { FirestoreAdapter } from '../adapters';
import { Converter } from '../converter';
import { FirestoreDAO } from '../dao';
import { FirestoreCollection, FirestoreDocument, ToFirestoreData } from '../interfaces';
import { FirestorePathBuilder } from '../path-builder';


const toPromise = callback => new Promise<ReturnType<typeof callback>>(async (resolve, reject) => {
  try { resolve(callback()); } catch (error) { reject(error); }
});

type HasId<ID = string> = {id: ID};

export class FirestoreRepository<
  Entity extends HasId, 
  FirestoreData = ToFirestoreData<Entity, dayjs.Dayjs>,
> extends FirestoreDAO<Entity, FirestoreData> {

  protected pathBuilder: FirestorePathBuilder<Entity>;

  constructor(adapter: FirestoreAdapter, converter?: Converter<Entity>) {
    super(adapter, converter);
  }

  list(paramMap?: Partial<Entity>, query: any = q => q) {
    return this._list(query(this.collection(paramMap)));
  }

  get(paramMap: Partial<Entity> & HasId) {
    return this._get(this.doc(paramMap as any));
  }

  save(entity: Entity): Promise<[Entity, boolean]> {
    // TODO(nontangent): なんでここの型定義でasがいるのか考える。
    return this._save(this.doc({id: entity || this.genId()} as any), entity);
  }

  create(entity: Partial<Entity> & HasId): Promise<Entity> {
    const obj = toObject(entity) as Entity;
    const id = obj?.id || this.genId();
    return toPromise(() => this.doc({...obj, id})).then(doc => this._create(doc, entity as Entity));
  }

  update(entity: Partial<Entity> & HasId): Promise<void> {
    return toPromise(() => this.doc(entity)).then(doc => this._update(doc, entity as Entity));
  }

  delete(paramMap: Partial<Entity>): Promise<void> {
    return this.doc(paramMap as any).delete();
  }

  bulkWrite(entities: Entity[]): Promise<void> {
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.set(doc, this.converter.toFirestore(entity));
    }, this.adapter.batch()).commit();
  }

  bulkUpdate(entities: (Partial<Entity> & HasId)[]): Promise<void> {
    // TODO(nontangent): add maximum 500 record validation
    return entities.reduce((batch, entity) => {
      const doc = this.doc(entity).__ref;
      return batch.update(doc, {
        ...this.converter.toFirestore(entity),
        ...this.buildServerTimestampObject(['updatedAt']),
      });
    }, this.adapter.batch()).commit();
  }

  protected genId = (): string => generateId();

  protected _list(collection: FirestoreCollection<FirestoreData>) {
    return collection.get().then(({docs}) => docs.map(doc => this.converter.fromFirestore(doc)));
  }

  protected _get(doc: FirestoreDocument<FirestoreData>) {
    return doc.get().then((doc => this.converter.fromFirestore(doc)));
  }

  protected _save(doc: FirestoreDocument<FirestoreData>, entity: Entity): Promise<[Entity, boolean]> {
    return this._set(doc, entity, !entity?.id)
      .then(doc => this.converter.fromFirestore(doc)).then(e => [e, !!entity?.id]); 
  }

  protected _create(doc: FirestoreDocument<FirestoreData>, entity: Entity): Promise<Entity> {
    return this._set(doc, entity, false).then(doc => this.converter.fromFirestore(doc)); 
  }

  protected _update(doc: FirestoreDocument<FirestoreData>, entity: Partial<Entity>): Promise<void> {
    return doc.update({
      ...this.converter.toFirestore(entity),
      ...this.buildServerTimestampObject(['updatedAt']),
    } as any).then(() => {}); 
  }

  protected _set(doc: FirestoreDocument<FirestoreData>, entity: Partial<Entity>, isUpdate = true) {
    return doc.set({
      ...this.converter.toFirestore(entity),
      ...this.buildServerTimestampObject(isUpdate ? ['updatedAt'] : []),
    } as any, {merge: isUpdate}).then(() => doc.get());
  }

  protected buildServerTimestampObject(keys: string[] = ['createdAt', 'updatedAt']) {
    return keys.reduce((m, k) => ({...m, [k]: this.adapter.FieldValue.serverTimestamp()}), {});
  }

}
