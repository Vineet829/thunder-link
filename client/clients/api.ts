import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient(
  "https://thunder.vineetpersonal.site/graphql",  {
    headers: () => ({
      Authorization: isClient
        ? `Bearer ${window.localStorage.getItem("__thunder_token")}`
        : "",
    }),
  }
);
