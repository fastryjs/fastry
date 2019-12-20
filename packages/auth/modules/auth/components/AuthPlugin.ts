import { HttpServer } from "@fastry/core-modules";
import { ComponentPlugin } from "@fastry/ioc";
import * as express from "express";
import passport from "passport";

@ComponentPlugin("server/http")
export default class AuthPlugin {
  public beforeApplyMiddlewares(server: HttpServer) {
    const app = server.app;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user: any, done: any) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (userId: string, done: any) => {
      done(null, {});
    });

    app.get("/auth/logout", (req: express.Request, res: express.Response) => {
      req.logout();
      res.redirect("/");
    });
  }
}
