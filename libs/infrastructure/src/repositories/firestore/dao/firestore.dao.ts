import dayjs from 'dayjs';
import { FirestoreAdapter } from '../adapters';
import { Converter } from '../converter';
import { FirestoreCollection,  FirestoreCollectionGroup,  FirestoreDocument, ToFirestoreData } from '../interfaces';
import { FirestorePathBuilder } from '../path-builder';


export abstract class FirestoreDAO<
  Entity extends {id: string}, 
  FirestoreData = ToFirestoreData<Entity, dayjs.Dayjs>,
> {
  protected abstract pathBuilder: FirestorePathBuilder<Entity>;

  constructor(
    protected adapter: FirestoreAdapter,
    protected converter: Converter<Entity>,
  ) { }

  protected collection(paramMap?: Partial<Entity>):FirestoreCollection<FirestoreData> {
    const path = this.pathBuilder.collection(paramMap)
    return this.adapter.collection<FirestoreData>(path);
  }

  protected collectionGroup():FirestoreCollectionGroup<FirestoreData> {
    const path = this.pathBuilder.collectionGroup();
    return this.adapter.collectionGroup<FirestoreData>(path);
  }

  protected doc(paramMap: Partial<Entity> & {id: string}): FirestoreDocument<FirestoreData> {
    const path = this.pathBuilder.doc(paramMap);
    return this.adapter.doc<FirestoreData>(path);
  }
}
