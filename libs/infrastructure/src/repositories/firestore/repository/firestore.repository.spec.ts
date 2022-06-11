import { initializeTest, testAdapterFactory, testTransaction, testUserTransaction, TransactionRepository, UserTransactionRepository } from '../testing';

initializeTest();

describe('FirestoreDecorator', () => {
  const adapter = testAdapterFactory();

  describe('TransactionRepository', () => {
    let repository: TransactionRepository;

    beforeEach(() => {
      repository = new TransactionRepository(adapter);
    });
  
    it('', async () => {
      await repository.create(testTransaction);
    });
  });

  describe('UserTransactionRepository', () => {
    let repository: UserTransactionRepository;

    beforeEach(() => {
      repository = new UserTransactionRepository(adapter);
    });
  
    it('create()', async () => {
      await repository.create(testUserTransaction);
      const path = `users/test-user-0001/transactions/test-transaction-0001`;
      expect((await adapter.doc(path).__ref.get()).exists).toBeTruthy();
    });

    it('delete()', async () => {
      await repository.delete(testUserTransaction);
      const path = `users/test-user-0001/transactions/test-transaction-0001`;
      expect((await adapter.doc(path).__ref.get()).exists).toBeFalsy();
    });
  })

});
