import { EMPTY_ARRAY } from '../util/empty';
import { stringify } from '../util/stringify';
import { Injector, resolveAndCreate } from './injector';
import { StaticProvider } from './interface/provider';
import { internalImportProvidersFrom } from './provider-collection';

export function createInjector(
  defType: /* InjectorType<any> */ any,
  additionalProviders: StaticProvider[] | null = null,
  parent: Injector | null = null,
  name?: string,
) {
  return createInjectorWithoutInjectorInstances(defType, parent, additionalProviders, name);
}

export function createInjectorWithoutInjectorInstances(
  defType: /* InjectorType<any> */ any,
  parent: Injector | null = null,
  additionalProviders: StaticProvider[] | null = null,
  name?: string,
): Injector {
  const providers = [
    ...internalImportProvidersFrom(defType),
    ...(additionalProviders || EMPTY_ARRAY),
  ];
  name = name || (typeof defType === 'object' ? undefined : stringify(defType));
  return resolveAndCreate(providers, parent || Injector.NULL);
}
