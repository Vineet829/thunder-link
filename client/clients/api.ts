import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient(
  "https://vineetpersonal.site:8000/graphql",  {
    headers: () => ({
      Authorization: isClient
        ? `Bearer ${window.localStorage.getItem("__thunder_token")}`
        : "",
    }),
  }
);
