import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_MEAL } from "../graphql/mutations";
import { GET_MEALS } from "../graphql/queries"; // Make sure this includes meal details

const EditMeal = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_MEALS);
  const [updateMeal] = useMutation(UPDATE_MEAL, {
    onCompleted: () => navigate("/dashboard"),
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    ingredients: "",
    instructions: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (data) {
      const meal = data.meals.find((m) => m._id === mealId);
      if (meal) {
        setFormData({
          name: meal.name,
          category: meal.category || "",
          ingredients: meal.ingredients.join(", "),
          instructions: meal.instructions || "",
          imageUrl: meal.imageUrl || "",
        });
      }
    }
  }, [data, mealId]);

  if (loading) return <p>Loading meal...</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMeal({
      variables: {
        mealId,
        name: formData.name,
        category: formData.category,
        ingredients: formData.ingredients.split(",").map((i) => i.trim()),
        instructions: formData.instructions,
        imageUrl: formData.imageUrl,
      },
    });
  };

  return (
    <div className="form-container">
      <h2>Edit Meal</h2>
      <form onSubmit={handleSubmit} className="styled-form">
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Category</label>
        <input name="category" value={formData.category} onChange={handleChange} required />

        <label>Ingredients (comma-separated)</label>
        <input name="ingredients" value={formData.ingredients} onChange={handleChange} required />

        <label>Instructions</label>
        <textarea name="instructions" value={formData.instructions} onChange={handleChange} required />

        <label>Image URL</label>
        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />

        <button type="submit">Update Meal</button>
      </form>
    </div>
  );
};

export default EditMeal;
