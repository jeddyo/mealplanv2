import React from "react";

const SavedMealCard = ({ meal }) => {
  return (
    <div className="saved-meal-card">
      <h4>{meal.name}</h4>
      <p className="meal-meta"><strong>Category:</strong> {meal.category}</p>

      {meal.ingredients && (
        <p className="meal-meta">
          <strong>Ingredients:</strong> {meal.ingredients.join(", ")}
        </p>
      )}

      {meal.instructions && (
        <p className="meal-meta">
          <strong>Instructions:</strong> {meal.instructions}
        </p>
      )}

      {meal.imageUrl && (
        <img
          src={meal.imageUrl.trim()}
          alt={meal.name}
          className="saved-meal-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300";
          }}
        />
      )}
    </div>
  );
};

export default SavedMealCard;
