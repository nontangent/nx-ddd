import dayjs from 'dayjs';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, scan, shareReplay, switchMap, take } from 'rxjs/operators';
import { FirestoreAdapter } from '../adapters';
import { Converter } from '../converter';
import { FirestoreDAO } from '../dao';
import { FirestorePathBuilder } from '../path-builder';
import { FirestoreCollection,  FirestoreCollectionGroup, ToFirestoreData } from '../interfaces';

export const action = <T extends {id: string}>(
  map: Map<string, T>, 
  type: 'removed' | string, 
  entity: T
): Map<string, T> => type === 'removed' 
  ? (map.delete(entity.id), map) 
  : map.set(entity.id, entity);

type CollectionRef<D> = FirestoreCollection<D> | FirestoreCollectionGroup<D>;
  
export class FirestoreQuery<
  Entity extends {id: string} = any, 
  FirestoreData = ToFirestoreData<Entity, dayjs.Dayjs>,
> extends FirestoreDAO<Entity, FirestoreData> {

  protected collection$ = new ReplaySubject<CollectionRef<FirestoreData>>(1);
  switchCollection(paramMap?: Partial<Entity>) {
    const collectionRef = paramMap ? this.collection(paramMap) : this.collectionGroup();
    this.collection$.next(collectionRef)
  }

  protected get list$(): Observable<Entity[]> {
    return this._list$ ??= this.collection$.pipe(
      switchMap((collection) => this._listChanges(collection)),
      shareReplay(1),
    );
    
  }
  protected _list$: Observable<Entity[]>;

  constructor(
    adapter: FirestoreAdapter,
    converter: Converter<Entity>,
    protected pathBuilder: FirestorePathBuilder<Entity>
  ) {
    super(adapter, converter);
    this.switchCollection();
  }

  listChanges(paramMap?: Partial<Entity>): Observable<Entity[]> {
    this.switchCollection(paramMap);
    return this.list$;
  }

  changes({id}: Partial<Entity>) {
    if (!id) throw new Error(`Invalid Id. it must be Truthy`);

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
