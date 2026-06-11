import axios from "axios";

const BASE_URL = "https://dummyjson.com";

// dummy add API
export const addToCartAPI = async (product) => {
  try {
    const res = await axios.post(`${BASE_URL}/carts/add`, {
      userId: 1,
      products: [
        {
          id: product.id,
          quantity: 1,
        },
      ],
    });

    return res.data;
  } catch (error) {
    console.log("Error:", error);
  }
};