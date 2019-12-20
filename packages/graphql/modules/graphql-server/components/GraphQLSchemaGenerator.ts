import { Component } from "@fastry/ioc";
import { GraphQLSchema } from "graphql";
import { makeSchema } from "nexus";
import * as path from "path";

@Component("graphql/schema")
export default class GraphQLSchemaGenerator {
  public getTypes(): any {
    return [];
  }

  public getSchema(): GraphQLSchema {
    return makeSchema({
      outputs: {
        schema: path.join(process.cwd(), "./schema.graphql")
        // typegen: path.join(__dirname, "../../my-generated-types.d.ts"),
      },
      types: this.getTypes()
    });
  }
}
