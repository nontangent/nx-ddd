import { Injector, ReflectiveInjector } from 'injection-js';

export { Injector };

export function resolveAndCreate(providers, parent = Injector.NULL) {
  return ReflectiveInjector.resolveAndCreate(providers, parent);
}
