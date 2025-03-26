import { gql } from "@apollo/client";

export const GET_MEALS = gql`
  query GetMeals {
    meals {
      _id
      name
      category
      ingredients
      instructions
      imageUrl
      createdBy {
        _id
        username
      }
    }
  }
`;
