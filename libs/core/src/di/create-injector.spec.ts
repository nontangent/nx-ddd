import { createInjectorWithoutInjectorInstances } from './create-injector';
import { AppModule, AppService, EXAMPLE_VALUE, Repository } from '../_testing';
import { Injectable } from 'injection-js';

@Injectable()
class ExampleRepository extends Repository {
  get name(): string {
    return 'ExampleRepository';
  }
}

describe('createInjectorWithoutInjectorInstances', () => {
  it('should be created', () => {
    const injector = createInjectorWithoutInjectorInstances(AppModule);
    expect(injector.get(EXAMPLE_VALUE)).toEqual('rootValue');
  });

  it('should get Repository', () => {
    const injector = createInjectorWithoutInjectorInstances(AppModule, undefined, [
      { provide: Repository, useValue: new ExampleRepository()},
    ]);
    expect(injector.get(AppService).repository.name).toEqual('ExampleRepository');
  })
});
