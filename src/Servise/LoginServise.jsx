// src/Servise/Auth.js
import axios from "axios";

export const loginUser = async (data) => {
  try {
    const res = await axios.post(
      "https://dummyjson.com/auth/login",
      data, 
      {
        headers: { "Content-Type": "application/json" },
        // withCredentials: true, 
      }
    );

    return res.data;
  } catch (error) {
    console.log("Login Error:", error);
    throw error.response?.data || { message: "Login failed" };
  }
};