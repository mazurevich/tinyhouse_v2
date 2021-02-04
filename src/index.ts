/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import { typeDefs, resolvers } from './graphql';
import { connectDatabase } from './database';

const PORT = process.env.PORT || 3000;

const mount = async (app: Application) => {
  const db = await connectDatabase();

  app.use(cookieParser(process.env.SECRET));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  server.applyMiddleware({ app, path: '/api' });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is up and running on port ${PORT}`);
  });
};

mount(express());
