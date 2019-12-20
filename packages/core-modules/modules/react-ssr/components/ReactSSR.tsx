import { Component } from "@fastry/ioc";
import express from "express";
import * as path from "path";
import React from "react";
// tslint:disable-next-line:no-submodule-imports
import { renderToString } from "react-dom/server";

@Component("server/react-ssr")
export default class ReactSSR {
  public async render(tree: React.ReactElement<any>, renderContext: any) {
    return renderToString(tree);
  }

  public async execute(
    self: ReactSSR,
    req: express.Request,
    res: express.Response
  ) {
    const renderContext = {};
    const tree = await self.getTree(renderContext);
    const content = await self.render(tree, renderContext);
    res.send(content);
  }

  private async getTree(renderContext: any): Promise<React.ReactElement<any>> {
    const App = require(path.join(process.cwd(), "client", "App")).default;
    const assets = require(path.join(
      process.cwd(),
      "pub",
      "static",
      "manifest.json"
    ));

    return (
      <html>
        <head />
        <div id="root">
          <App />
        </div>
        <script src={assets["app.js"] ? assets["app.js"] : "/static/app.js"} />
      </html>
    );
  }
}
