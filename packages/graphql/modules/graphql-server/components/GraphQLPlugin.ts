import { ComponentPlugin, getInstance } from "@fastry/ioc";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import GraphQLSchemaGenerator from "./GraphQLSchemaGenerator";

@ComponentPlugin("server/http")
export default class GraphQLPlugin {
  public beforeStart() {
    const app = express();
    const schemaGenerator = getInstance<GraphQLSchemaGenerator>(
      "graphql/schema"
    );

    const server = new ApolloServer({
      context: {},
      schema: schemaGenerator.getSchema()
    });

    server.applyMiddleware({ app, path: "/graphql" });

    app.listen(4112, () => {
      // console.log(
      //   `GraphQL server is running on http://${process.env.VIRTUAL_HOST}:4112`,
      // ),
    });
  }
}
