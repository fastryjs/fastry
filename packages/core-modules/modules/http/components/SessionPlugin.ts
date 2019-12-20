import { AppConfig } from "@fastry/core";
import { ComponentPlugin } from "@fastry/ioc";
import redis from "connect-redis";
import ExpressSession from "express-session";
import redisClient from "redis";
import HttpServer from "./HttpServer";

@ComponentPlugin("server/http")
export default class SessionPlugin {
  public beforeApplyMiddlewares(server: HttpServer) {
    const redisStore = redis(ExpressSession);
    const client = redisClient.createClient(AppConfig.get("redis"));

    server.app.use(
      ExpressSession({
        cookie: { secure: false, maxAge: 86400000 },
        resave: false,
        rolling: true,
        saveUninitialized: false,
        secret: AppConfig.get("session.secret"),
        store: new redisStore({
          client
        })
      })
    );
  }
}
