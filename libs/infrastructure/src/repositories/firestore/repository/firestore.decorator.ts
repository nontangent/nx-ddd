import { Entity } from '@nx-ddd/domain/models';
import camelCase from 'lodash.camelcase';
import { Converter as BaseConverter } from '../converter';
import { pathBuilderFactory } from '../path-builder';
import { FirestoreQuery } from '../query';
import { FirestoreRepository } from '../repository';


export interface FirestoreOptions<E extends Entity = any, EntityClass extends typeof Entity = any> {
  Entity: EntityClass;
  Converter?: typeof BaseConverter;
  Query?: typeof FirestoreQuery;
  path: string;
}

export function Firestore({Entity, Converter, Query, path}: FirestoreOptions) {
  return <T extends { new (...args: any[]): {} }>(constructor: T): any => {
    const __ConverterClass = Converter ?? BaseConverter;
    const __QueryClass = Query ?? FirestoreQuery;
    const __path = path ?? resolvePathByEntity(Entity);

    return class extends FirestoreRepository<typeof Entity> {
      protected pathBuilder = pathBuilderFactory(__path);
    
      query = new __QueryClass(this.adapter, this.converter, this.pathBuilder);
    
      constructor(adapter, converter = new __ConverterClass(Entity, adapter)) {
        super(adapter, converter);
      }
    }
  }
}

function resolvePathByEntity(EntityClass: typeof Entity): string {
  return `${camelCase(EntityClass.name)}s`;
}
