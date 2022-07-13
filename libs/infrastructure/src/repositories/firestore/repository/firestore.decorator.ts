import { Injectable, Inject, Optional } from '@nx-ddd/core';
import { Entity } from '@nx-ddd/domain/models';
import { Class } from 'injection-js';
import camelCase from 'lodash.camelcase';
import { FirestoreAdapter } from '../adapters';
import { FirestoreConverter } from '../converter';
import { pathBuilderFactory } from '../path-builder';
import { FirestoreQuery } from '../query';
import { FirestoreRepository } from '../repository';

export interface Firestore<
  E extends Entity = any, 
  EntityClass extends typeof Entity = any,
  ConverterClass extends typeof FirestoreConverter = any,
> {
  Entity: EntityClass;
  Converter?: ConverterClass;
  Query?: typeof FirestoreQuery;
  path: string;
}

export function Firestore({Entity, Converter, Query, path}: Firestore) {
  return function <T extends { new (...args: any[]): {} }>(target: T): any {
    const __ConverterClass = Converter ?? FirestoreConverter;
    const __QueryClass = Query ?? FirestoreQuery;
    const __path = path ?? resolvePathByEntity(Entity);

    @Injectable()
    class _ extends FirestoreRepository<typeof Entity> {
      protected pathBuilder = pathBuilderFactory(__path);
    
      query = new __QueryClass(this.adapter, this.converter, this.pathBuilder);
    
      constructor(
        // @Inject(FirestoreAdapter)
        adapter: FirestoreAdapter, 
        @Optional()
        // @Inject(FirestoreConverter)
        converter: FirestoreConverter,
      ) {
        converter ??= new __ConverterClass(Entity, adapter);
        super(adapter, converter);
      }
    };

    Object.defineProperty(_, 'name', {value: target.name, writable: false});

    return _
  }
}

function resolvePathByEntity(EntityClass: typeof Entity): string {
  return `${camelCase(EntityClass.name)}s`;
}
