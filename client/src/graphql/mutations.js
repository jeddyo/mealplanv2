import { gql } from "@apollo/client";

export const UPDATE_MEAL = gql`
  mutation UpdateMeal(
    $mealId: ID!
    $name: String!
    $ingredients: [String!]!
    $instructions: String!
    $category: String!
    $imageUrl: String
  ) {
    updateMeal(
      mealId: $mealId
      name: $name
      ingredients: $ingredients
      instructions: $instructions
      category: $category
      imageUrl: $imageUrl
    ) {
      _id
      name
      category
      ingredients
      instructions
      imageUrl
    }
  }
`;
