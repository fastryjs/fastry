import { pluginContext, registry } from "./registry";

export function ComponentPlugin(component: string) {
  return (constructor: any) => {
    if (!pluginContext[component]) {
      pluginContext[component] = {};
    }

    if (!registry[component]) {
      registry[component] = [];
    }

    registry[component].push(constructor.prototype);
    constructor.apply(pluginContext[component]);
  };
}
