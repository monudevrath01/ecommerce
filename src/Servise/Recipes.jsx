import axios from "axios";

const API = axios.create({
  baseURL: "https://dummyjson.com/recipes",
});

//  GET ALL RECIPES
export const getRecipes = async () => {
  try {
    const res = await API.get("/");
    return res.data.recipes; //  important
  } catch (error) {
    console.error("Get Recipes Error:", error);
    throw error;
  }
};