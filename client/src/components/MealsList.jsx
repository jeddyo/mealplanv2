import React, { useEffect, useState } from "react";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [savedMeals, setSavedMeals] = useState([]);

  const token = localStorage.getItem("token");

  const fetchMeals = async () => {
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            meals {
              _id
              name
              category
              ingredients
              instructions
            }
          }
        `,
      }),
    });
    const { data } = await response.json();
    setMeals(data.meals);
  };

  const fetchSavedMeals = async () => {
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: `query { me { savedMeals { _id name } } }` }),
    });
    const { data } = await response.json();
    setSavedMeals(data.me?.savedMeals || []);
  };

  const handleSave = async (mealId) => {
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation SaveMeal($mealId: ID!) {
            saveMeal(mealId: $mealId) {
              savedMeals {
                _id
                name
              }
            }
          }
        `,
        variables: { mealId },
      }),
    });
    const { data } = await response.json();
    setSavedMeals(data.saveMeal.savedMeals);
  };

  const handleRemove = async (mealId) => {
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation RemoveMeal($mealId: ID!) {
            removeMeal(mealId: $mealId) {
              savedMeals {
                _id
                name
              }
            }
          }
        `,
        variables: { mealId },
      }),
    });
    const { data } = await response.json();
    setSavedMeals(data.removeMeal.savedMeals);
  };

  useEffect(() => {
    fetchMeals();
    if (token) fetchSavedMeals();
  }, []);

  return (
    <div>
      <h3>Available Meals</h3>
      {meals.map((meal) => (
        <div key={meal._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
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
    </div>
  );
};

export default MealsList;
