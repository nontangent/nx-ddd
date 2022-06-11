import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, scan, shareReplay, take } from 'rxjs/operators';
import { FirestoreAdapter } from '../adapters';
import { Converter } from '../converter';
import { FirestoreDAO } from '../dao';
import { FirestorePathBuilder } from '../path-builder';
import { FirestoreCollection,  FirestoreCollectionGroup, ToFirestoreData } from '../interfaces';

const action = <T extends {id: string}>(
  map: Map<string, T>, 
  type: 'removed' | string, 
  entity: T
): Map<string, T> => type === 'removed' 
  ? (map.delete(entity.id), map) 
  : map.set(entity.id, entity);

  
export class FirestoreQuery<
  Entity extends {id: string} = any, 
  FirestoreData = ToFirestoreData<Entity, dayjs.Dayjs>,
> extends FirestoreDAO<Entity, FirestoreData> {

  protected get list$(): Observable<Entity[]> {
    return this._list$ ??= this._listChanges(this.collection()).pipe(shareReplay(1)); 
  }
  protected _list$: Observable<Entity[]>;

  constructor(
    adapter: FirestoreAdapter,
    converter: Converter<Entity>,
    protected pathBuilder: FirestorePathBuilder<Entity>
  ) {
    super(adapter, converter);
  }

  listChanges(paramMap?: Partial<Entity>): Observable<Entity[]> {
    return this.list$;
  }

  changes({id}: Partial<Entity>) {
    return this.list$.pipe(
      map(entities => entities.find(entity => entity.id === id)),
      distinctUntilChanged((pre, cur) => JSON.stringify(pre) === JSON.stringify(cur)),
    );
  }

  get({id}: Partial<Entity> & {id: string}) {
    return this.list$.pipe(
      take(1),
      map(entities => entities.find(entity => entity.id === id)),
    ).toPromise();
  }

  list(paramMap?: Partial<Entity>) {
    return this.list$.pipe(take(1)).toPromise();
  }

  protected _listChanges(
    collection: FirestoreCollection<FirestoreData> | FirestoreCollectionGroup<FirestoreData>
  ): Observable<Entity[]> {
    return collection.stateChanges().pipe(
      scan((map, actions) => actions.reduce((_map, {type, payload: {doc}}) => {
        return action<Entity>(_map, type, this.converter.fromFirestore(doc))
      }, map), new Map<string, Entity>()),
      map(map => [...map.values()]),
    );
  }
}
