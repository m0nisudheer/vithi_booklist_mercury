import { startServerAndCreateNextHandler } from "@as-integrations/next";
import mercury from "@mercury-js/core";
import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import resolvers from "./signup"; 
import typeDefs from "./typedef"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import "./model";
import "./profile";


mercury.connect("mongodb+srv://charan:123@cluster0.qidbhqj.mongodb.net/BookCollection");

// mercury.package([historyTracking()]);
mercury.addGraphqlSchema(typeDefs, resolvers);

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs: mercury.typeDefs,
    resolvers: mercury.resolvers,
  })
);

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
    let role = "ADMIN";
    let id = "1";
    if (token) {
      try {
        const verify = jwt.verify(token,"vithi");
        if (!(verify.exp < Math.floor(Date.now() / 1000))) {
          role = verify.role;
          id = verify.id;
        }
      } catch (err) {
        console.error("JWT verification failed", err);
      }
    }
    return {
      ...req,
      user: {
        id,
        profile: role,
      },
    };
  },
});

exports.MercuryInstance = mercury;

exports.GET = async function (request) {
  return handler(request);
};

exports.POST = async function (request) {
  return handler(request);
};