import { AppModule, EXAMPLE_VALUE } from '../_testing';
import { createNxModuleRef } from './nx-module-ref';

describe('createNxModuleRef', () => {
  it('should be created', () => {
    const appModuleRef = createNxModuleRef(AppModule);
    expect(appModuleRef.injector.get(EXAMPLE_VALUE)).toEqual('rootValue');
  });
});
