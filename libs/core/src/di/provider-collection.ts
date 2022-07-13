import { Type } from './interface/type';
import { getInjectorDef, hasInjectaorDef, InjectorTypeWithProviders } from './interface/defs';
import { ClassProvider, ConstructorProvider, ExistingProvider, FactoryProvider, ModuleWithProviders, Provider, StaticClassProvider, TypeProvider, ValueProvider } from './interface/provider';
import { resolveForwardRef } from './forward_ref';
import { deepForEach } from '../util/array_utils';
import { getFactoryDef } from './definition-factory';
import { EMPTY_ARRAY } from '../util/empty';

// import { getFactoryDef } from '../render3/definition_factory';
// import { EMPTY_ARRAY } from '../util/empty';
// import { ENVIRONMENT_INITIALIZER } from './initializer_token';
// import { ɵɵinject as inject } from './injector_compatibility';
// import { INJECTOR_DEF_TYPES } from './internal_tokens';

export type ImportProvidersSource =
  Type<unknown> | ModuleWithProviders<unknown> | Array<ImportProvidersSource>;

export type SingleProvider = TypeProvider | ValueProvider | ClassProvider | ConstructorProvider |
  ExistingProvider | FactoryProvider | StaticClassProvider;

export function internalImportProvidersFrom(...sources: ImportProvidersSource[]): SingleProvider[] {
  const providersOut: SingleProvider[] = [];
  walkProviderTree(sources as (Type<unknown>| InjectorTypeWithProviders<unknown>)[], [], (providers: any[]) => {
    deepForEach(providers, provider => providersOut.push(provider));
  });
  return providersOut;
}

function getNxModuleType(container: Type<unknown> | InjectorTypeWithProviders<unknown>): Type<unknown> {
  const isNxModuleType = (obj): obj is Type<unknown> => hasInjectaorDef(obj);
  return isNxModuleType(container) ? container : container.nxModule;
}

export function walkProviderTree(
  sources: (Type<unknown> | InjectorTypeWithProviders<unknown>)[],
  parents: Type<unknown>[],
  callback: (providers: Provider[]) => void,
  dedup = new Set<Type<unknown>>(),
) {
  deepForEach(sources, container => {
    container = resolveForwardRef(container);
    if (!container) return;
  
    const nxModuleType = getNxModuleType(container);
    const injDef = getInjectorDef(nxModuleType);
    if (!injDef) return;
  
    if (!dedup.has(nxModuleType) && dedup.add(nxModuleType)) {
      walkProviderTree(injDef.imports ?? [], parents, callback, dedup);
      callback([
        { provide: nxModuleType, useFactory: getFactoryDef(nxModuleType) || (() => new nxModuleType!()), deps: EMPTY_ARRAY },
        // { provide: INJECTOR_DEF_TYPES, useValue: nxModuleType, multi: true },
        // { provide: ENVIRONMENT_INITIALIZER, useValue: () => inject(nxModuleType!), multi: true },
        ...(injDef.providers ?? []),
      ]);
    }

    const isInjectorTypeWithProviders = 
      (container): container is InjectorTypeWithProviders<any> => container !== nxModuleType;

    isInjectorTypeWithProviders(container) && callback(container.providers ?? []);
  });
}

