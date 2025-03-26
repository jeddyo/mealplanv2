import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";
import MealCard from "../components/MealCard";
import SavedMealCard from "../components/SavedMealCard";

const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      savedMeals {
        _id
        name
        category
        ingredients
        instructions
        imageUrl
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
      imageUrl
      createdBy {
        _id
        username
      }
    }
  }
`;

const SAVE_MEAL = gql`
  mutation SaveMeal($mealId: ID!) {
    saveMeal(mealId: $mealId) {
      savedMeals {
        _id
        name
      }
    }
  }
`;

const REMOVE_MEAL = gql`
  mutation RemoveMeal($mealId: ID!) {
    removeMeal(mealId: $mealId) {
      savedMeals {
        _id
        name
      }
    }
  }
`;

const DELETE_MEAL = gql`
  mutation DeleteMeal($mealId: ID!) {
    deleteMeal(mealId: $mealId)
  }
`;

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    loading: mealsLoading,
    data: mealsData,
    refetch: refetchMeals,
  } = useQuery(GET_MEALS, {
    fetchPolicy: "cache-and-network", // 👈 Ensures fresh data
  });

  const {
    loading: meLoading,
    data: meData,
    refetch: refetchMe,
  } = useQuery(GET_ME, {
    fetchPolicy: "cache-and-network", // 👈 Ensures fresh data
  });

  const [saveMeal] = useMutation(SAVE_MEAL, { onCompleted: refetchMe });
  const [removeMeal] = useMutation(REMOVE_MEAL, { onCompleted: refetchMe });
  const [deleteMeal] = useMutation(DELETE_MEAL, {
    onCompleted: () => {
      refetchMeals();
      refetchMe();
    },
  });

  // 👇 Refetch meals and user data when Dashboard first mounts
  useEffect(() => {
    refetchMeals();
    refetchMe();
  }, []);

  if (meLoading || mealsLoading) return <p>Loading...</p>;
  if (!meData?.me || !mealsData?.meals) return <p>Error loading meals</p>;

  const userId = meData.me._id;
  const savedMeals = meData.me.savedMeals;
  const meals = mealsData.meals;

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(search.toLowerCase()) ||
    meal.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Meal Planner</h1>
        <div className="button-group">
          <button className="save" onClick={() => navigate("/create")}>Create Meal</button>
          <button className="delete" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
        </div>
      </div>

      <input
        type="text"
        className="search"
        placeholder="Search meals..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="dashboard-layout">
        <div className="main-content">
          <h2 className="section-title">Available Meals</h2>
          {filteredMeals.map((meal) => (
            <MealCard
              key={meal._id}
              meal={meal}
              userId={userId}
              savedMeals={savedMeals}
              onSave={(id) => saveMeal({ variables: { mealId: id } })}
              onRemove={(id) => removeMeal({ variables: { mealId: id } })}
              onDelete={(id) => {
                if (window.confirm("Are you sure you want to delete this meal?")) {
                  deleteMeal({ variables: { mealId: id } });
                }
              }}
            />
          ))}
        </div>

        <div className="sidebar">
          <h2 className="section-title">Saved Meals</h2>
          {savedMeals.length > 0 ? (
            savedMeals.map((meal) => (
              <SavedMealCard key={meal._id} meal={meal} />
            ))
          ) : (
            <p>No saved meals yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
