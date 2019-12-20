import * as fs from "fs";
import path from "path";
import { AppConfig } from "./AppConfig";

interface IRoute {
  [path: string]: string;
}

interface IManifest {
  routes?: IRoute[];
}

export class ModuleLoader {
  public rootDirs: string[];
  public manifests: IManifest[];

  constructor() {
    const fastryCoreDir = path.resolve(
      path.join(require.resolve("@fastry/core-modules"), "../")
    );

    this.manifests = [];
    this.rootDirs = [
      path.resolve(process.cwd(), "modules"),
      path.join(path.dirname(require.resolve("@fastry/core-modules"))),
      path.join(path.dirname(require.resolve("@fastry/graphql"))),
      path.join(path.dirname(require.resolve("@fastry/auth")))
    ];
  }

  public getManifests(): IManifest[] {
    return this.manifests;
  }

  public load() {
    const coreModules = ["graphql-server", "react-ssr", "http"];
    const modules = [...coreModules, ...AppConfig.get("modules", [])];

    for (const modName of modules) {
      for (const rootDir of this.rootDirs) {
        try {
          const fullPath = require.resolve(
            path.join(rootDir, modName, "manifest.json")
          );
          this.loadModule(fullPath);
          break;
        } catch (e) {
          // ignore
        }
      }
    }
  }

  public loadModule(manifestPath: string) {
    const manifest = require(manifestPath);
    const modulePath = path.dirname(manifestPath);
    const componentsDir = path.join(modulePath, "components");

    this.manifests.push(manifest);

    if (fs.existsSync(componentsDir)) {
      const components = fs.readdirSync(componentsDir);

      try {
        // plugins first
        for (const componentFile of components) {
          if (componentFile.includes(".d.") || componentFile.includes(".map")) {
            continue;
          }
          if (componentFile.includes("Plugin")) {
            require(path.join(componentsDir, componentFile));
          }
        }

        for (const componentFile of components) {
          if (
            componentFile.includes(".d.") ||
            componentFile.includes("Plugin") ||
            componentFile.includes(".map")
          ) {
            continue;
          }
          require(path.join(componentsDir, componentFile));
        }
      } catch (e) {
        // console.error(`Error loading modules from ${componentsDir}`, e)
      }
    }
  }
}
