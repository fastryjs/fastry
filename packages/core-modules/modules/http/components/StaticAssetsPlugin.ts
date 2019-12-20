import { ComponentPlugin } from "@fastry/ioc";
import * as express from "express";
import * as path from "path";
import HttpServer from "./HttpServer";

@ComponentPlugin("server/http")
export default class StaticAssetsPlugin {
  public beforeApplyMiddlewares(server: HttpServer) {
    const publicPath = path.join(process.cwd(), "pub");
    
    const assets = express.static(path.join(publicPath, "static"));
    const storage = express.static(path.join(publicPath, "storage"));

    server.app.use("/static", assets);
    server.app.use("/storage", storage);
  }
}
