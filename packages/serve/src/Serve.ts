import { ModuleLoader } from "@fastry/core";
import { HttpServer } from "@fastry/core-modules";
import { getInstance } from "@fastry/ioc";

export class Serve {
  public async start() {
    const loader = new ModuleLoader();
    loader.load();

    const server = getInstance<HttpServer>("server/http");
    await server.init(loader);
    await server.start();
  }
}
