function stringify(token: any): string {
  if (typeof token === 'string') { 
    return token;
  } else if(token?.name) {
    return token.name;
  }
  return token.toString();
}

export class InjectionToken<T = any> {
  constructor(private _desc: string) { }

  toString(): string {
    return `InjectionToken ${stringify(this._desc)}`;
  }
}

interface UseClassProvider {
  provide: InjectionToken | {new(...args: any[]): any};
  useClass: {new(...args: any[]): any},
  deps?: any[];
}

interface UseValueProvider {
  provide: InjectionToken | {new(...args: any[]): any};
  useValue: any;
}

interface UseFactoryProvider {
  provide: InjectionToken | {new(...args: any[]): any};
  useFactory: (...args: any[]) => any;
  deps?: any[];
}

export type Provider = UseClassProvider | UseValueProvider | UseFactoryProvider | any;
export type Providers = Provider[];

export class Injector {
  static fromProviders(providers: Provider[]): Injector {
    const injector = new Injector();
    injector.registerProviders(providers);
    return injector;
  }

  protected providers: Provider[] = [];

  get<T>(token: any): T {
    const provider = this.providers.reverse().find(provider => {
      return provider.provide === token || provider === token
    });

    if(!provider) throw new Error(`${stringify(token)} is not provided.`);

    if ('useClass' in provider) {
      return new provider.useClass(this, ...(provider?.deps ?? [])) as never as T;
    } else if ('useValue' in provider) {
      return provider.useValue;
    } else if ('useFactory' in provider) {
      return provider.useFactory(...(provider?.deps ?? []));
    } else {
      return new provider(this);
    }

  }

  registerProviders(providers: Provider[]) {
    this.providers = [...this.providers, ...providers];
  }
}
