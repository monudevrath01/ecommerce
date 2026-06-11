import React, { useEffect, useState } from "react";
import { getRecipes } from "../Servise/Recipes";
import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Loader UI
  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        ⏳ Loading recipes...
      </h2>
    );
  }

  return (
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      
      {/* Heading */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#333",
        }}
      >
        🍽️ Recipes
      </h1>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {recipes.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/recipe/${item.id}`)} 
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "0.3s",
              cursor: "pointer",
            }}
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            {/* Title */}
            <h3 style={{ margin: "10px 0", color: "#222" }}>
              {item.name}
            </h3>

            {/* Rating */}
            <p style={{ margin: "5px 0", color: "#f39c12" }}>
              ⭐ {item.rating}
            </p>

            {/* Cuisine */}
            <p style={{ margin: "5px 0", color: "#555" }}>
               {item.cuisine}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;