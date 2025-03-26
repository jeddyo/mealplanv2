import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const CREATE_MEAL = gql`
  mutation CreateMeal(
    $name: String!
    $ingredients: [String!]!
    $instructions: String!
    $category: String!
    $imageUrl: String
  ) {
    createMeal(
      name: $name
      ingredients: $ingredients
      instructions: $instructions
      category: $category
      imageUrl: $imageUrl
    ) {
      _id
      name
    }
  }
`;

const CreateMeal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    ingredients: "",
    instructions: "",
    imageUrl: "",
  });

  const [createMeal, { error }] = useMutation(CREATE_MEAL, {
    onCompleted: () => navigate("/dashboard"),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMeal({
      variables: {
        name: formData.name,
        category: formData.category,
        ingredients: formData.ingredients.split(",").map((item) => item.trim()),
        instructions: formData.instructions,
        imageUrl: formData.imageUrl,
      },
    });
  };

  return (
    <div className="form-container">
      <h2>Create a New Meal</h2>
      <form onSubmit={handleSubmit} className="styled-form">
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Category</label>
        <input name="category" value={formData.category} onChange={handleChange} required />

        <label>Ingredients (comma-separated)</label>
        <input name="ingredients" value={formData.ingredients} onChange={handleChange} required />

        <label>Instructions</label>
        <textarea name="instructions" value={formData.instructions} onChange={handleChange} required />

        <label>Image URL (optional)</label>
        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />

        <button type="submit">Create Meal</button>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default CreateMeal;
