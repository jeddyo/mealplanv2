import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";

const GET_ME = gql`
  query GetMe {
    me {
      username
      savedMeals {
        _id
        name
        category
        ingredients
        instructions
      }
    }
  }
`;

const GET_MEALS = gql`
  query GetMeals {
    meals {
      _id
      name
      category
      ingredients
      instructions
    }
  }
`;

const SAVE_MEAL = gql`
  mutation SaveMeal($mealId: ID!) {
    saveMeal(mealId: $mealId) {
      username
      savedMeals {
        _id
        name
        category
        ingredients
        instructions
      }
    }
  }
`;

const REMOVE_MEAL = gql`
  mutation RemoveMeal($mealId: ID!) {
    removeMeal(mealId: $mealId) {
      username
      savedMeals {
        _id
        name
        category
        ingredients
        instructions
      }
    }
  }
`;

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { loading: mealsLoading, error: mealsError, data: mealsData } = useQuery(GET_MEALS);
  const { loading: meLoading, error: meError, data: meData, refetch } = useQuery(GET_ME);

  const [saveMeal] = useMutation(SAVE_MEAL, {
    onCompleted: () => refetch(),
  });

  const [removeMeal] = useMutation(REMOVE_MEAL, {
    onCompleted: () => refetch(),
  });

  useEffect(() => {
    if (meError) {
      console.error("Error fetching user data:", meError.message);
    }
  }, [meError]);

  if (meLoading || mealsLoading) return <p>Loading...</p>;
  if (meError || mealsError) return <p>Error loading data.</p>;

  const handleSave = (mealId) => {
    saveMeal({ variables: { mealId } });
  };

  const handleRemove = (mealId) => {
    removeMeal({ variables: { mealId } });
  };

  const savedMeals = meData?.me?.savedMeals || [];

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>

      <h3>Available Meals</h3>
      {mealsData?.meals.map((meal) => (
        <div key={meal._id} style={{ border: "1px solid #ccc", marginBottom: "15px", padding: "10px" }}>
          <h4>{meal.name}</h4>
          <p><strong>Category:</strong> {meal.category}</p>
          <p><strong>Ingredients:</strong> {meal.ingredients.join(", ")}</p>
          <p><strong>Instructions:</strong> {meal.instructions}</p>
          {savedMeals.some((saved) => saved._id === meal._id) ? (
            <button onClick={() => handleRemove(meal._id)}>Remove Meal</button>
          ) : (
            <button onClick={() => handleSave(meal._id)}>Save Meal</button>
          )}
        </div>
      ))}

      <h3>Saved Meals:</h3>
      {savedMeals.length > 0 ? (
        <ul>
          {savedMeals.map((meal) => (
            <li key={meal._id}>
              <strong>{meal.name}</strong> - {meal.category}
              <p><strong>Ingredients:</strong> {meal.ingredients.join(", ")}</p>
              <p><strong>Instructions:</strong> {meal.instructions}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No meals saved yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
