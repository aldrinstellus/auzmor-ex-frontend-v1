export const isModuleAccessible = (
  accessibleModules: string[],
  module: string | Record<string, string>
): boolean => {
  if (module && typeof module === "object") {
    return accessibleModules.some((m) => Object.values(module).includes(m));
  }
  return accessibleModules.includes(module as string);
};
