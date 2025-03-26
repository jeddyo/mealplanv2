const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedMeals: [Meal]
  }

  type Meal {
    _id: ID!
    name: String!
    category: String
    instructions: String
    ingredients: [String]
    imageUrl: String
    createdBy: User
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    me: User
    meals: [Meal]
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(username: String!, email: String!, password: String!): AuthPayload
    saveMeal(mealId: ID!): User
    removeMeal(mealId: ID!): User
    createMeal(name: String!, ingredients: [String!]!, instructions: String!, category: String!, imageUrl: String): Meal
    deleteMeal(mealId: ID!): Boolean
  }
`;

module.exports = typeDefs;
