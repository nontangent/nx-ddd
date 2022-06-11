import { pathBuilderFactory, resolvePaths } from './path-builder';

interface Transaction {
  userId: string;
  id: string;
}

describe('pathBuilderFactory', () => {
  describe(`pathBuilderFactory('transactions')`, () => {
    const builder = pathBuilderFactory(`transactions`);

    it(`given doc({id: '1'}), returns 'transactions/1'`, () => {
      expect(builder.doc({id: '1'})).toEqual(`transactions/1`);
    });

    it(`given collection(), returns 'transactions'`, () => {
      expect(builder.collection()).toEqual(`transactions`);
    });

    it(`given collectionGroup(), returns 'transactions'`, () => {
      expect(builder.collectionGroup()).toEqual(`transactions`);
    });
  });
  
  describe(`pathBuilderFactory('users/:userId/transactions')`, () => {
    let builder = pathBuilderFactory<Transaction>(`users/:userId/transactions`);
    
    it(`given doc({id: '1'}), returns 'transactions/1'`, () => {
      expect(builder.doc({userId: '0', id: '1'})).toEqual(`users/0/transactions/1`);
    });

    it(`given collection({userId: '0'}), returns 'transactions/1'`, () => {
      expect(builder.collection({userId: '0'})).toEqual(`users/0/transactions`);
    });

    it(`given collectionGroup(), returns 'transactions/1'`, () => {
      expect(builder.collectionGroup()).toEqual(`transactions`);
    });
  });

  describe(`pathBuilderFactory('users/:userId/transactions/:id')`, () => {
    let builder = pathBuilderFactory<Transaction>(`users/:userId/transactions/:id`);
    
    it(`given doc({id: '1'}), returns 'transactions/1'`, () => {
      expect(builder.doc({userId: '0', id: '1'})).toEqual(`users/0/transactions/1`);
    });

    it(`given collection({userId: '0'}), returns 'transactions/1'`, () => {
      expect(builder.collection({userId: '0'})).toEqual(`users/0/transactions`);
    });

    it(`given collectionGroup(), returns 'transactions/1'`, () => {
      expect(builder.collectionGroup()).toEqual(`transactions`);
    });
  });
});

describe(`resolvePaths()`, () => {
  it(``, () => {
    const paths = ['users', ':userId', 'organizations', ':organizationId'];
    const params = {userId: '001', organizationId: '11'}
    expect(resolvePaths(params, paths)).toEqual(`users/001/organizations/11`);
  });
});
