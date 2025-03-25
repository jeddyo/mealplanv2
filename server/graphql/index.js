const { ApolloServer } = require("apollo-server-express");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const schema = makeExecutableSchema({ typeDefs, resolvers });

const createApolloServer = async (app) => {
  const server = new ApolloServer({
    schema,
  });

  await server.start();
  app.use("/graphql", expressMiddleware(server));
  console.log("🚀 Apollo Server is running at /graphql");
};

module.exports = createApolloServer;
