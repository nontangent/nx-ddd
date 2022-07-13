import { NxModule } from '../nx-module';
import { Injectable, InjectionToken } from 'injection-js';
import 'reflect-metadata';

export const EXAMPLE_VALUE = new InjectionToken('examole value');


@Injectable()
export abstract class Repository {
  get name(): string {
    throw new Error('Repository.name is not implemented!');
  }
}

@Injectable()
export class AppService {
  constructor(public repository: Repository) { }
}

@NxModule({
  imports: [],
  providers: [{ provide: EXAMPLE_VALUE, useValue: 'featureValue'}],
})
export class FeatureModule { }

@NxModule({
  imports: [
    FeatureModule,
  ],
  providers: []
})
export class LibraryModule {
  static forRoot() {
    return {
      nxModule: LibraryModule,
      providers: [
        {provide: EXAMPLE_VALUE, useValue: 'rootValue'},
      ],
    }
  }
}

@NxModule({
  imports: [
    LibraryModule.forRoot(),
  ],
  providers: [
    AppService,
    Repository,
  ]
})
export class AppModule { }
