import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RecipeDetail = () => {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH RECIPE
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(
          `https://dummyjson.com/recipes/${id}`
        );
        setRecipe(res.data);
        setActiveImg(res.data.image);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  if (!recipe) return <h2>No Recipe Found</h2>;

  return (
    <div className="container py-5">
      <div className="row">

        {/* LEFT SIDE IMAGE */}
        <div className="col-md-6">
          <img
            src={activeImg}
            className="img-fluid rounded mb-3"
            alt="recipe"
          />

          {/* Thumbnail (optional same image) */}
          <div className="d-flex gap-2">
            <img
              src={recipe.image}
              width="80"
              className="border p-1"
              style={{ cursor: "pointer" }}
              onClick={() => setActiveImg(recipe.image)}
              alt=""
            />
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="col-md-6">
          <h2>{recipe.name}</h2>

          <h5 className="text-success">
            🍽️ {recipe.cuisine}
          </h5>

          <h6>⭐ Rating: {recipe.rating}</h6>
          <h6>⏱ Prep Time: {recipe.prepTimeMinutes} min</h6>
          <h6>🔥 Cook Time: {recipe.cookTimeMinutes} min</h6>
          <h6>👨‍👩‍👧 Servings: {recipe.servings}</h6>
          <h6>📊 Difficulty: {recipe.difficulty}</h6>

          {/* Tags */}
          <div className="my-2">
            {recipe.tags?.map((tag, i) => (
              <span key={i} className="badge bg-dark me-2">
                {tag}
              </span>
            ))}
          </div>

          {/* Ingredients */}
          <div className="mt-3">
            <h5>🧂 Ingredients</h5>
            <ul>
              {recipe.ingredients?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mt-3">
            <h5>📖 Instructions</h5>
            <ol>
              {recipe.instructions?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-5">
        <h3>Customer Reviews</h3>

        {recipe.reviews?.map((review, i) => (
          <div key={i} className="border p-3 mb-2 rounded">
            <h6>{review.reviewerName}</h6>
            <p>⭐ {review.rating}</p>
            <p>{review.comment}</p>
            <small className="text-muted">
              {new Date(review.date).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeDetail;