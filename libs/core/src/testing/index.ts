import { NxModule } from '@nx-ddd/core/nx-module';
import { createInjector, InjectionToken } from '../di';
import { Type } from '../di/interface/type';

export interface TestModuleMetadata {
  imports?: any[],
  providers?: any[],
}

export interface TestBedStatic {
  inject<T>(token: Type<T> | InjectionToken<T>): T;
}

export class TestBed { 
  static _instance: TestBedStatic;
  static get instance() {
    return this._instance ??= new TestBed(this.NxModule);
  }

  static NxModule?: Type<any>;

  static configureTestingModule(moduleDef: TestModuleMetadata): TestBedStatic {
    TestBed.NxModule = NxModule({
      imports: [...(moduleDef.imports ?? [])],
      providers: [...(moduleDef.providers ?? [])],
    })(class NxModule { });
    return this.instance;
  }

  static inject<T>(token: Type<T> | InjectionToken<T>): T {
    return this.instance.inject(token);
  }
 
  public injector = createInjector(this.nxModule);

  constructor(public nxModule: Type<any>) { }

  public inject<T>(token: Type<T> | InjectionToken<T>): T {
    return this.injector.get(token);
  }
}