import { createInjector, NxModule } from '@nx-ddd/core';
import { Entity } from '@nx-ddd/domain/models';
import { FirestoreAdapter } from '../adapters';
import { FirestoreConverter } from '../converter';
import { Firestore } from './firestore.decorator';

class Example extends Entity { }

@Firestore({
  Entity: Example,
  path: 'example',
})
class ExampleRepository { }

@NxModule({
  providers: [
    ExampleRepository,
    { provide: FirestoreAdapter, useValue: { collectionGroup: jest.fn()} },
    FirestoreConverter,
  ],
})
export class ExampleModule { }

describe('FirestoreDecorator', () => {
  const injector = createInjector(ExampleModule);
  
  it('should create repository', () => {
    const repository = injector.get(ExampleRepository);
    console.debug('repository:', repository);
    expect(repository).toBeTruthy();
    
  });
});
