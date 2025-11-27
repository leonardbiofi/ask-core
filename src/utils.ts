export function lazy<Mod extends { default: new (...args: any[]) => any }>(
  importer: () => Promise<Mod>,
  ...constructorArgs: ConstructorParameters<Mod["default"]>
) {
  type T = InstanceType<Mod["default"]>;
  let instance: Promise<T> | null = null;

  const load = () =>
    (instance ??= importer().then((m) => new m.default(...constructorArgs)));

  return new Proxy({} as T, {
    get(_, prop: keyof T) {
      return (...args: any[]) =>
        load().then((svc) => {
          const result = (svc as any)[prop](...args);
          return result instanceof Promise ? result : Promise.resolve(result);
        });
    },
  }) as AsyncifyMethods<T>;
}

// Wrap all methods to return Promise, avoid double-wrapping
export type AsyncifyMethods<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => Promise<infer R>
    ? (...args: A) => Promise<R>
    : T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[K];
};
