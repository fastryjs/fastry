import { ApolloProvider } from "@apollo/react-common";
import { getDataFromTree } from "@apollo/react-ssr";
import { ComponentPlugin } from "@fastry/ioc";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { GraphQLSchema } from "graphql";
// @ts-ignore
import fetch from "node-fetch";
import React from "react";

export function getClient() {
  // schema: GraphQLSchema, context: Object
  const cache = new InMemoryCache();

  // @ts-ignore
  const client = new ApolloClient({
    ssrMode: true,

    // shouldBatch: true,

    // link: new SchemaLink({
    //   schema,
    //   context
    // }),

    link: createHttpLink({
      fetch,
      uri: "http://0.0.0.0:7080/graphql"
    }),

    cache
  });

  return client;
}

@ComponentPlugin("server/react-ssr")
export default class ReactSSRPlugin {
  public afterGetTree(
    self: any,
    result: React.ReactElement<any>,
    renderContext: any
  ): React.ReactElement<any> {
    // console.log("in react ssr plugin");
    const client = getClient();
    renderContext.client = client;
    return <ApolloProvider client={client}>{result}</ApolloProvider>;
  }

  public async aroundRender(self: any, original: () => void, args: any) {
    const tree = args[0];
    const renderContext = args[1];

    await getDataFromTree(tree);

    // console.log('client state:', renderContext.client.extract())

    return original.apply(self, args);
  }
}
