import { NG_INJ_DEF } from './interface/defs';
import { internalImportProvidersFrom } from './provider-collection';

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
  };
}

@NxModule({
  imports: [],
  providers: [{ provide: 'test', useValue: 'featureValue'}],
})
class FeatureModule { }

@NxModule({
  imports: [
    FeatureModule,
  ],
  providers: []
})
class LibraryModule {
  static forRoot() {
    return {
      nxModule: LibraryModule,
      providers: [
        {provide: 'test', useValue: 'rootValue'},
      ],
    }
  }
}

@NxModule({
  imports: [
    LibraryModule.forRoot(),
  ]
})
class AppModule { }

describe('internalImportProvidersFrom', () => {
  it('', () => {
    const modules = [
      AppModule,
    ];

    const providers = internalImportProvidersFrom(modules);
    console.debug('providers:', providers);
  });
});

describe('NxModuleRef', () => {
  
})