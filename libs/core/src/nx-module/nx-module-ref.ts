import { Injector } from 'injection-js';
import { createInjectorWithoutInjectorInstances } from '../di/create-injector';

export type Type<T> = any;

export function createNxModuleRef<T>(moduleType: Type<T>, injector?: Injector): NxModuleRef<T> {
  return new NxModuleRef(moduleType, injector ?? null);
}

export class NxModuleRef<T = any> {
  public injector: Injector;
  public instance: T;

  constructor(
    public nxModuleType: Type<T>,
    public _parent: Injector,
  ) {
    this.injector = createInjectorWithoutInjectorInstances(nxModuleType, _parent);
    this.instance = this.injector.get(nxModuleType);
  }
}

export class NxModuleFactory<T> {
  constructor(public moduleType: Type<T>) { }

  create(parentInjector: Injector|null): NxModuleRef<T> {
    return new NxModuleRef(this.moduleType, parentInjector);
  }
}
