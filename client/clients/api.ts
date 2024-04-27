import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient(
  "https://d213k0kfmzs5wg.cloudfront.net/graphql",  {
    headers: () => ({
      Authorization: isClient
        ? `Bearer ${window.localStorage.getItem("__thunder_token")}`
        : "",
    }),
  }
);
