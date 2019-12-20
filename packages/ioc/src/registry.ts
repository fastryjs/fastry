export const registry = {};
export const components = {};
export const pluginContext: Array<{ [key: string]: object }> = [];

export function getInstance<T>(componentName: string): T {
  // console.log('components',components)
  if (!components[componentName]) {
    throw new Error(`component ${componentName} is not defined`);
  }
  return new components[componentName]();
}
