import { generateId } from '@nx-ddd/firestore/common/utilities/generate-id';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, scan, shareReplay, take } from 'rxjs/operators';
import { pick } from 'lodash';
import { FirestoreEntityConstructor } from './entity';
import {
  CommonFirestoreCollection, 
  CommonFirestoreCollectionGroup, 
  CommonFirestoreDocument, 
  DocumentSnapshot, 
  FirestoreData,
} from './interfaces';
import { BaseFirestoreDateAdapter, FirestoreAdapter, FirestoreFieldsAdapter } from './adapters';


const action = <T extends {id: string}>(
  map: Map<string, T>, 
  type: 'removed' | string, 
  entity: T
): Map<string, T> => type === 'removed' 
  ? (map.delete(entity.id), map) 
  : map.set(entity.id, entity);

const toPromise = callback => new Promise<ReturnType<typeof callback>>(async (resolve, reject) => {
  try { resolve(callback()); } catch (error) { reject(error); }
});

export abstract class CommonFirestoreRepository<Entity extends {id: string}, Data extends object, Date> {
  protected abstract Entity: FirestoreEntityConstructor<Entity, Data>;

  protected abstract buildCollectionPath: (paramMap?: Partial<Entity>) => string;
  protected abstract buildCollectionGroupPath: (paramMap?: Partial<Entity>) => string;
  protected abstract buildDocPath: (paramMap: Partial<Entity>) => string;

  constructor(
    private _firestore: FirestoreAdapter,
    private _fields: FirestoreFieldsAdapter,
    private _date: BaseFirestoreDateAdapter<Date>,
  ) { }

  private _list$: Observable<Entity[]>;
  get list$(): Observable<Entity[]> {
    return this._list$ ??= this.listChanges().pipe(shareReplay(1)); 
  }

  getV2(_id: string): Observable<Entity> {
    return this.listV2().pipe(map(entities => entities.find(({id}) => id === _id)));
  }

  listV2(): Observable<Entity[]> {
    return this.list$.pipe(take(1)); 
  }

  listChanges(): Observable<Entity[]> {
    return this._listChanges(this.collection());
  }

  changes({id}: Partial<Entity>) {
    return this.list$.pipe(
      map(entities => entities.find(entity => entity.id === id)),
      distinctUntilChanged((pre, cur) => JSON.stringify(pre) === JSON.stringify(cur)),
    );
  }

  list(paramMap?: Partial<Entity>) {
    return this._list(this.collection(paramMap));
  }

  get(paramMap: Partial<Entity>) {
    return this._get(this.doc(paramMap));
  }

  save(entity: Entity): Promise<[Entity, boolean]> {
    // TODO(nontangent): なんでここの型定義でasがいるのか考える。
    return this._save(this.doc({id: entity.id || this.genId()} as Partial<Entity>), entity);
  }

  create(entity: Entity): Promise<Entity> {
    const id = entity?.id || this.genId();
    return toPromise(() => this.doc({...entity, id})).then(doc => this._create(doc, entity));
  }

  update(entity: Entity): Promise<void> {
    return toPromise(() => this.doc(entity)).then(doc => this._update(doc, entity));
  }

  protected genId = (): string => generateId();

  protected collection(paramMap?: Partial<Entity>): CommonFirestoreCollection<Data> {
    const path = this.buildCollectionPath(paramMap)
    return this._firestore.collection<Data>(path);
  }

  protected collectionGroup(paramMap?: Partial<Entity>): CommonFirestoreCollectionGroup<Data> {
    const path = this.buildCollectionGroupPath(paramMap);
    return this._firestore.collectionGroup<Data>(path);
  }

  protected doc(paramMap: Partial<Entity>): CommonFirestoreDocument<Data> {
    const path = this.buildDocPath(paramMap);
    return this._firestore.doc<Data>(path);
  }

  protected _listChanges(
    collection: CommonFirestoreCollection<Data> | CommonFirestoreCollectionGroup<Data>
  ): Observable<Entity[]> {
    return collection.stateChanges().pipe(
      scan((map, actions) => actions.reduce((_map, {type, payload: {doc}}) => {
        return action<Entity>(_map, type, this.converter.fromFirestore(doc))
      }, map), new Map<string, Entity>()),
      map(map => [...map.values()]),
    );
  }

  protected _list(collection: CommonFirestoreCollection<Data>) {
    return collection.get()
      .pipe(map(({docs}) => docs.map(doc => this.converter.fromFirestore(doc))));
  }

  protected _get(doc: CommonFirestoreDocument<Data>) {
    return doc.get().pipe(map(doc => this.converter.fromFirestore(doc)));
  }

  protected _save(doc: CommonFirestoreDocument<Data>, entity: Entity): Promise<[Entity, boolean]> {
    return this._set(doc, entity, !entity?.id)
      .then(doc => this.converter.fromFirestore(doc)).then(e => [e, !!entity?.id]); 
  }

  protected _create(doc: CommonFirestoreDocument<Data>, entity: Entity): Promise<Entity> {
    return this._set(doc, entity, false).then(doc => this.converter.fromFirestore(doc)); 
  }

  protected _update(doc: CommonFirestoreDocument<Data>, entity: Entity): Promise<void> {
    return this._set(doc, entity, true).then(() => {}); 
  }

  protected _set(doc: CommonFirestoreDocument<Data>, entity: Entity, isUpdate = true) {
    return doc.set({
      ...this.converter.toFirestore(entity),
      ...this.buildServerTimestampObject(isUpdate ? ['updatedAt'] : undefined),
    }).then(() => doc.get().toPromise());
  }

  protected buildServerTimestampObject(keys: string[] = ['createdAt', 'updatedAt']) {
    return keys.reduce((m, k) => ({...m, [k]: this._fields.FieldValue.serverTimestamp()}), {});
  }

  protected get converter() {
    return {
      fromFirestore: (doc: DocumentSnapshot<Data>) => {
        const data = this.Entity.fromFirestoreDoc(({
          id: doc.id, ref: { path: doc.ref.path }, 
          data: () => this._date.fromFirestore<Data>(doc.data() as FirestoreData<Data, Date>),
        }));
        return data;
      },
      toFirestore: (entity: Entity) => {
        const data = pick(this._date.toFirestore(entity), this.Entity.FIELDS) as Data;
        return data;
      },
    }
  }

}
