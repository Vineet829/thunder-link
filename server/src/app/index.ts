import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "../clients/db";
import path from "path"
import { User } from "./user";
import { Post } from "./post";
import { GraphqlContext } from "../intefaces";
import JWTService from "../services/jwt";

export async function initServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  app.get("/", (req, res) =>
    res.status(200).json({ message: "Everything is good" })
  );



  // Serve the Next.js static files
  const nextJsOutDir = path.join(__dirname, '../out'); // Adjust the path to where your 'out' directory is located
  app.use(express.static(nextJsOutDir));

  app.get("/", (req, res) => {
    // Serve the index.html file from the Next.js 'out' directory for the root path
    res.sendFile(path.join(nextJsOutDir, 'index.html'));
  });

  
  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
       ${User.types}
       ${Post.types}

        type Query {
            ${User.queries}
            ${Post.queries}
        }

        type Mutation {
          ${Post.muatations}
          ${User.mutations}
        }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Post.resolvers.queries,
      },
      Mutation: {
        ...Post.resolvers.mutations,
        ...User.resolvers.mutations,
      },
      ...Post.resolvers.extraResolvers,
      ...User.resolvers.extraResolvers,
    },
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization
            ? JWTService.decodeToken(
                req.headers.authorization.split("Bearer ")[1]
              )
            : undefined,
        };
      },
    })
  );

  return app;
}
