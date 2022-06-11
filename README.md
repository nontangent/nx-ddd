# [WIP] Nx DDD
This is a full stack framework for Domain Driven Development on @nrwl/Nx



## @nx-ddd/common


## @nx-ddd/domain
```ts
import { Entity } from '@nx-ddd/domain/models/entity';
import dayjs from 'dayjs';

export interface Transfer extends Entity {
  amount: number;
  dealAt: dayjs.Dayjs;
}

export class Transfer extends Entity {
  static readonly FIELDS = ['amount', 'dealAt'];

  get description(): string {
    return `This is $${this.amount} transfer at ${this.dealAt.format(`YYYY/MM/DD`)}`;
  }
}
```


## @nx-ddd/infrastructure
```ts
import { Firestore, FirestoreRepository } from '@nx-ddd/infrastructure/repositories/firestore';
import { Transfer } from '@example/domain/models';

@Firestore({
  Entity: Transfer,
  path: `users/:userId/transfers/:id`
})
export class TransferRepository extends FirestoreRepository<Transfer> { }
```

```ts
import { Transfer } from '@example/domain/models';
import { TransferRepository } from '@example/infrastructure/repositories';
import { AdminFirestoreAdapter } from '@nx-ddd/infrastructure/repositories/firestore/adapters/admin';
import dayjs from 'dayjs';

const adaptor = new AdminFirestoreAdapter();
const repository = new TransferRepository(adapter);

async function exampleUseCase() {
  await repository.create(Transfer.fromObj({amount: 3000, dealAt: dayjs()}));
} 

exampleUseCase();
```

## @nx-ddd/executors

