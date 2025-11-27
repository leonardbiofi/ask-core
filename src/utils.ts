export function lazy<Mod extends { default: new (...args: any[]) => any }>(
  importer: () => Promise<Mod>,
  ...constructorArgs: ConstructorParameters<Mod["default"]>
): InstanceType<Mod["default"]> {
  type T = InstanceType<Mod["default"]>;
  let instance: Promise<T> | null = null;

  const load = () =>
    (instance ??= importer().then((m) => new m.default(...constructorArgs)));

  return new Proxy({} as T, {
    get(_, prop) {
      return (...args: any[]) =>
        load().then((svc) => (svc as any)[prop](...args));
    },
  });
}
