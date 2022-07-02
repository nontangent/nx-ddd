export function BooleanObject(parms?: {}) {
  return function _BooleanObject<T>(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return this[`_${propertyKey}`];
      },
      set: function (value: T) {
        if (typeof value !== 'boolean') throw new TypeError(`Invalid type, got ${typeof value} not boolean.`);
        this[`_${propertyKey}`] = value;
      },
    }); 
  }
}
