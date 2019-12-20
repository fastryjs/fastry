import { components, pluginContext, registry } from "./registry";

export function Component(component: string) {
  console.log("comp:",component)
  const rewriteMethods = (constructor: any) => {
    // has a plugin?
    if (registry[component]) {
      const plugins = registry[component];
      const methods = Object.keys(constructor.prototype);
      const overrideMap = {};

      for (const plugin of plugins) {
        for (const method of methods) {
          const original = constructor.prototype[method];
          const name = method[0].toUpperCase() + method.substr(1);

          if (
            !overrideMap[name] &&
            (plugin["before" + name] ||
              plugin["after" + name] ||
              plugin["around" + name])
          ) {
            overrideMap[name] = true;

            // console.log("override", method);
            constructor.prototype[method] = function() {
              // @ts-ignore
              for (const pluginEntry of plugins) {
                if (pluginEntry["before" + name]) {
                  pluginEntry["before" + name].apply(pluginContext[component], [
                    this,
                    // @ts-ignore
                    ...arguments
                  ]);
                }
              }

              // @ts-ignore
              let result;
              let hasAroundPlugin = false;
              for (const pluginEntry of plugins) {
                if (pluginEntry["around" + name]) {
                  hasAroundPlugin = true;
                  result = pluginEntry["around" + name].apply(
                    pluginContext[component],
                    [
                      this,
                      original,
                      // @ts-ignore
                      arguments
                    ]
                  );
                }
              }

              if (!hasAroundPlugin) {
                result = original.apply(this, arguments);
              }

              // @ts-ignore
              for (const pluginEntry of plugins) {
                if (pluginEntry["after" + name]) {
                  pluginEntry["after" + name].apply(pluginContext[component], [
                    this,
                    result,
                    // @ts-ignore
                    ...arguments
                  ]);
                }
              }

              return result;
            };
          }
        }
      }
    }
  };

  return (constructor: any) => {
    rewriteMethods(constructor);
    components[component] = constructor;
  };
}
