import { ModuleLoader } from "@fastry/core";
import { Component, getInstance } from "@fastry/ioc";
import express from "express";
import * as http from "http";

@Component("server/http")
export default class HttpServer {
  public app: express.Express;
  public loader: ModuleLoader;

  public async init(loader: ModuleLoader) {
    this.app = express();
    this.loader = loader;
    await this.applyMiddlewares();
  }

  public async applyMiddlewares() {
    const manifests = this.loader.getManifests();

    for (const manifest of manifests) {
      if (manifest.routes) {
        for (const [path, value] of Object.entries(manifest.routes)) {
          // @ts-ignore
          const handler = getInstance<any>(value);

          this.app.get(path, (req, res) => {
            handler.execute(handler, req, res);
          });
        }
      }
    }
  }

  public async start(): Promise<http.Server> {
    return this.app.listen(4111, () => {
      // console.log(
      //   `Web server is running on http://${process.env.VIRTUAL_HOST}:4111`
      // )
    });
  }
}
