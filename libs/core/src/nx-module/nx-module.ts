import { NG_INJ_DEF } from '../di/interface/defs';

export interface NxModule {
  imports?: any[],
  providers?: any[],
}

export function NxModule(nxModule: NxModule) {
  return function (target) {
    target[NG_INJ_DEF] = {
      imports: [...(nxModule.imports ?? [])],
      providers: [...(nxModule.providers ?? [])],
    };
    return target;
  };
}
