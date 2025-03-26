import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const CREATE_MEAL = gql`
  mutation CreateMeal(
    $name: String!
    $category: String!
    $ingredients: [String!]!
    $instructions: String!
    $imageUrl: String
  ) {
    createMeal(
      name: $name
      category: $category
      ingredients: $ingredients
      instructions: $instructions
      imageUrl: $imageUrl
    ) {
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

const CreateMeal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    ingredients: "",
    instructions: "",
    imageUrl: "",
  });

  const [createMeal, { loading, error }] = useMutation(CREATE_MEAL, {
    update(cache, { data: { createMeal } }) {
      try {
        const existingData = cache.readQuery({ query: GET_MEALS });

        if (existingData && existingData.meals) {
          cache.writeQuery({
            query: GET_MEALS,
            data: {
              meals: [...existingData.meals, createMeal],
            },
          });
        }
      } catch (err) {
        console.warn(
          "GET_MEALS query not found in cache — skipping cache update."
        );
      }
    },
    onCompleted: () => {
      navigate("/dashboard");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ingredientsArray = formData.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    createMeal({
      variables: {
        name: formData.name,
        category: formData.category,
        ingredients: ingredientsArray,
        instructions: formData.instructions,
        imageUrl: formData.imageUrl || null,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Create a New Meal</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">
            Ingredients (comma-separated)
          </label>
          <input
            type="text"
            name="ingredients"
            required
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Instructions</label>
          <textarea
            name="instructions"
            required
            value={formData.instructions}
            onChange={handleChange}
            rows={4}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Image URL (optional)</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Meal"}
        </button>

        {error && (
          <p className="text-red-500 mt-2">Error creating meal: {error.message}</p>
        )}
      </form>
    </div>
  );
};

export default CreateMeal;
