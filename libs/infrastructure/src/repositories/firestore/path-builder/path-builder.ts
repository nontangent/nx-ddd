type CollectionParamMap<Entity extends {id: string}> = Partial<Entity>;
type DocParamMap<Entity extends {id: string}> = CollectionParamMap<Entity> & Pick<Entity, 'id'>;

export class FirestorePathBuilder<Entity extends { id: string }> {
  doc = (param: DocParamMap<Entity>) => resolvePaths(param, this.paths);
  collection = (param: CollectionParamMap<Entity> = {}) => resolvePaths(param, this.paths.slice(0, -1));
  collectionGroup = () => this.paths[this.paths.length-2];

  constructor(private paths: string[]) { }
}

export const pathBuilderFactory = <E extends { id: string }>(
  path: string
): FirestorePathBuilder<E> => {
  const paths = parsePath(path);
  return new FirestorePathBuilder(paths);
};

export const parsePath = (path: string): string[] => {
  const paths = path.split('/').filter(p => p.length);
  if (!paths[paths.length-1].startsWith(':')) paths.push(':id');
  return paths;
}

export const resolvePaths = (obj: object, paths: string[]): string => {
  return paths.map((path) => path.startsWith(':') ? resolvePath(obj, path.slice(1)) : path).join('/');
}

const resolvePath = (obj: object, key: string) => {
  if (!obj?.[key]) throw new Error(`Invalid key is detected in resolving paths, :${key}`);
  return obj?.[key];
}
