import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import fs from 'fs';
import https from 'https';
import path from "path";
import { prismaClient } from "../clients/db";
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

  const sslOptions = {
    key: fs.readFileSync('/home/vineet/thunder-link-server/server/src/private.key'),
    cert: fs.readFileSync('/home/vineet/thunder-link-server/server/src/certificate.crt'),
    ca: fs.readFileSync('/home/vineet/thunder-link-server/server/src/ca_bundle.crt') 
};

  
  const httpsServer = https.createServer(sslOptions, app);


  const PORT = 3000; 

  
  httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server is running on https://localhost:${PORT}`);
  });

  return app;
}

