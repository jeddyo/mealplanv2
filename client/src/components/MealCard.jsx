import React from "react";
import { useNavigate } from "react-router-dom";

const MealCard = ({ meal, userId, savedMeals, onSave, onRemove, onDelete }) => {
  const navigate = useNavigate();
  const isSaved = savedMeals.some((saved) => saved._id === meal._id);
  const isCreator = meal.createdBy?._id === userId;

  return (
    <div className="card" style={{ position: "relative" }}>
      {/* ✏️ Edit button in corner */}
      {isCreator && (
        <button
          className="edit-btn"
          onClick={() => navigate(`/edit/${meal._id}`)}
        >
          ✏️ Edit
        </button>
      )}

      <h3>{meal.name}</h3>
      <p className="meal-meta"><strong>Category:</strong> {meal.category}</p>
      <p className="meal-meta"><strong>Ingredients:</strong> {meal.ingredients.join(", ")}</p>
      <p className="meal-meta"><strong>Instructions:</strong> {meal.instructions}</p>

      {meal.imageUrl && (
        <img
          src={meal.imageUrl.trim()}
          alt={meal.name}
          className="meal-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300";
          }}
        />
      )}

      <p className="meal-meta"><em>Created by:</em> {meal.createdBy?.username || "Unknown"}</p>

      <div style={{ marginTop: "1rem" }}>
        {isSaved ? (
          <button className="remove" onClick={() => onRemove(meal._id)}>Remove</button>
        ) : (
          <button className="save" onClick={() => onSave(meal._id)}>Save</button>
        )}

        {isCreator && (
          <button className="delete" onClick={() => onDelete(meal._id)} style={{ marginLeft: "0.5rem" }}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default MealCard;
