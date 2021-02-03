import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';
import { connectDatabase } from './database';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const mount = async (app: Application) => {
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
  });
  server.applyMiddleware({ app, path: '/api' });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is up and running on port ${PORT}`);
  });
};

mount(express());
