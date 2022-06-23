import { InjectionToken, Injector } from './injector';

const DOMAIN = new InjectionToken('domain');

class Item {
  constructor(
    injector: Injector,
    public domain = injector.get(DOMAIN),
  ) { }

  get type(): string {
    return 'Item';
  }
};

class Book extends Item {
  get type(): string {
    return 'Book';
  }
};

describe('Injector', () => {
  let injector: Injector;

  it('should provide Item as Item', () => {
    injector = Injector.fromProviders([
      {provide: Item, useClass: Item},
      {provide: DOMAIN, useValue: 'library'}
    ]);

    const item = injector.get<Item>(Item);
    expect(item.type).toEqual('Item');
  });

  it('should be created', () => {
    injector = Injector.fromProviders([
      {provide: Item, useClass: Book},
      {provide: DOMAIN, useValue: 'library'}
    ]);

    const item = injector.get<Item>(Item);
    expect(item.type).toEqual('Book');
  });

  it('should provide `library` as `domain`', () => {
    injector = Injector.fromProviders([
      {provide: Item, useClass: Book},
      {provide: DOMAIN, useValue: 'library'}
    ]);

    const item = injector.get<Item>(Item);
    expect(item.type).toEqual('Book');
    expect(item.domain).toEqual('library');
  });
});
