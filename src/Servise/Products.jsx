import axios from "axios";

const BASE_URL = "https://dummyjson.com/products";

// Helper to get local custom products
const getLocalProducts = () => {
  try {
    return JSON.parse(localStorage.getItem("customProducts")) || [];
  } catch (error) {
    console.error("Error loading custom products:", error);
    return [];
  }
};

//  Get All Products
export const getProducts = async (limit = null) => {
  try {
    const local = getLocalProducts();
    const apiLimit = limit !== null ? limit : 100;
    const response = await axios.get(BASE_URL, {
      params: { limit: apiLimit },
    });

    const apiProducts = response.data.products || [];
    // Combine custom products with API products
    const combined = [...local, ...apiProducts];
    return limit ? combined.slice(0, limit) : combined;
  } catch (error) {
    console.log("API Error:", error);
    return getLocalProducts();
  }
};

// Search products
export const searchProducts = async (query) => {
  try {
    const local = getLocalProducts();
    const filteredLocal = local.filter(p => 
      (p.title && p.title.toLowerCase().includes(query.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
    );

    const response = await axios.get(`${BASE_URL}/search`, {
      params: { q: query },
    });

    return [...filteredLocal, ...(response.data.products || [])];
  } catch (error) {
    console.log("Search Error:", error);
    const local = getLocalProducts();
    return local.filter(p => 
      (p.title && p.title.toLowerCase().includes(query.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );
  }
};

//   Man Products
export const getMenProducts = async () => {
  try {
    const local = getLocalProducts();
    const filteredLocal = local.filter(p => 
      p.category === "mens-shirts" || 
      p.category === "mens-shoes" || 
      (p.title && p.title.toLowerCase().includes("men")) ||
      (p.description && p.description.toLowerCase().includes("men"))
    );

    const res = await axios.get(`${BASE_URL}/search`, {
      params: { q: "man" },
    });

    return [...filteredLocal, ...(res.data.products || [])];
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
};

// Kids Products
export const getKidsProducts = async () => {
  try {
    const local = getLocalProducts();
    const filteredLocal = local.filter(p => 
      p.category === "kids" || 
      (p.title && p.title.toLowerCase().includes("kid")) ||
      (p.description && p.description.toLowerCase().includes("kid"))
    );

    const res = await axios.get(`${BASE_URL}/search`, {
      params: { q: "kids" },
    });

    return [...filteredLocal, ...(res.data.products || [])];
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
};

// Accessories Products
export const getAccessories = async () => {
  try {
    const local = getLocalProducts();
    const filteredLocal = local.filter(p => 
      p.category === "accessories" || 
      (p.title && p.title.toLowerCase().includes("accessory")) ||
      (p.title && p.title.toLowerCase().includes("watch")) ||
      (p.title && p.title.toLowerCase().includes("bag"))
    );

    const res = await axios.get(`${BASE_URL}/search`, {
      params: { q: "Accessories" },
    });

    return [...filteredLocal, ...(res.data.products || [])];
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
};

export const getProductsByBrand = async (brandName) => {
  try {
    const local = getLocalProducts();
    const filteredLocal = local.filter(p => 
      p.brand && p.brand.toLowerCase().includes(brandName.toLowerCase())
    );

    const res = await axios.get(BASE_URL);
    const apiProducts = res.data.products || [];

    const filteredApi = apiProducts.filter(
      (item) =>
        item.brand &&
        item.brand.toLowerCase().includes(brandName.toLowerCase())
    );

    return [...filteredLocal, ...filteredApi];
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
};

export const getSaleProducts = async () => {
  try {
    const local = getLocalProducts();
    const filteredLocal = local.filter(p => p.discountPercentage > 10);

    const res = await axios.get(BASE_URL);
    const apiProducts = res.data.products || [];

    const filteredApi = apiProducts.filter(
      (item) => item.discountPercentage > 10
    );

    return [...filteredLocal, ...filteredApi];
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
};

export const getBlogs = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data.posts || [];
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
};