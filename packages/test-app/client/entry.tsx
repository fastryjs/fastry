import React from "react";
import { hydrate } from "react-dom";
import { hot } from "react-hot-loader";
import AppComponent from "./App";

const isDev = process.env.NODE_ENV !== "production";
let Mod = AppComponent;
if (isDev) {
  Mod = hot(module)(AppComponent);
}

function Entry() {
  return <Mod />;
}

hydrate(
  <>
    {/*<Helmet htmlAttributes={{ lang: 'en' }} />*/}
    <Entry />
  </>,

  document.getElementById("root")
);
