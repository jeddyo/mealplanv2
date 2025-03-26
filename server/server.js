const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const bodyParser = require("body-parser");

// Load typeDefs and resolvers
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Optional: Health check route
app.get("/", (req, res) => {
  res.send("Meal Planner API is live 🎉");
});

// Start Apollo Server
async function startApolloServer() {
  try {
    const server = new ApolloServer({ schema });
    await server.start();

    app.use(
      "/graphql",
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ req }),
      })
    );

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.error("❌ Error starting Apollo Server:", err);
  }
}

startApolloServer();
