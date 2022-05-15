import { toObject } from '@nx-ddd/common/utilities/to-object';
import { Dayjs, isDayjs } from 'dayjs';
import { omit, pick } from 'lodash';
import { flatten } from 'flat';
import { DocumentSnapshot } from './interfaces';


export type DomainLangMap<Entity> =  Partial<{[K in keyof Entity]: string}>


export interface FirestoreEntityConstructor<Entity, FirestoreData> {
  new (): Entity;
  FIELDS: any;

  fromFirestoreDoc: (doc: DocumentSnapshot<any>) => Entity;
  fromFirestoreDocs: (docs: DocumentSnapshot<any>[]) => Entity[];
  toFirestoreDoc: (entity: Entity) => FirestoreData;
}


export interface FirestoreEntity {
  id: string | null;
  createdAt: Dayjs | null;
  updatedAt: Dayjs | null;
}


export class FirestoreEntity {
  static FIELDS: any;

  static fromObject<T>(obj: object): T {
    return Object.assign(new this(), obj) as never as T;
  }

  static fromFirestoreDoc<T>(doc: DocumentSnapshot<any>): T {
    return this.fromObject({...doc.data(), id: doc.id});
  }

  static fromFirestoreDocs<T>(docs: DocumentSnapshot<any>[]): T[] {
    return docs.map(doc => this.fromFirestoreDoc(doc)) as T[];
  }

  static toFirestoreDoc<T>(data: T): any {
    return pick(data, this.FIELDS);
  }

  static toObject<T extends object, D>(entity: T): D {
    return toObject(entity) as never as D;
  }

  static toFlattenObject<T extends object, D>(entity: T): D {
    const keys = Object.entries(entity).filter(([_, v]) => isDayjs(v)).map(([k] )=> k);
    return {
      ...flatten(this.toObject(omit(entity, keys))),
      ...this.toObject(pick(entity, keys)),
    } as D;
  }
}