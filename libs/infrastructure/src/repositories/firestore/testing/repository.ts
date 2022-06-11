import { Firestore, FirestoreRepository } from "../repository";
import { Transaction, UserTransaction } from "./domain";

@Firestore({
  Entity: Transaction,
  path: 'transactions',
})
export class TransactionRepository extends FirestoreRepository<Transaction> { }

@Firestore({
  Entity: UserTransaction,
  path: `users/:userId/transactions`,
})
export class UserTransactionRepository extends FirestoreRepository<UserTransaction> { }
