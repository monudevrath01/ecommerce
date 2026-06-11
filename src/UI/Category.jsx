import React, { useEffect, useState } from "react";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import { getProducts } from "../Servise/Products";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

// Category Icons Mapper
const categoryIcons = {
  groceries: "../src/assets/images/icon-vegetables-broccoli.png",
  drinks: "../src/assets/images/icon-soft-drinks-bottle.png",
  chocolates: "../src/assets/images/icon-bread-baguette.png",
  beauty: "../src/assets/images/icon-bread-herb-flour.png",
  fragrances: "../src/assets/images/icon-wine-glass-bottle.png",
  "mens-shirts": "../src/assets/images/icon-animal-products-drumsticks.png",
  "mens-shoes": "../src/assets/images/icon-animal-products-drumsticks.png",
  "womens-dresses": "../src/assets/images/icon-vegetables-broccoli.png",
  "womens-shoes": "../src/assets/images/icon-vegetables-broccoli.png",
};

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fetch unique categories present in the products catalog
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const prods = await getProducts();
        const uniqueCats = [...new Set(prods.map((p) => p.category).filter(Boolean))];
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Re-initialize Swiper when categories state is populated
  useEffect(() => {
    if (categories.length === 0) return;

    const swiper = new Swiper(".category-carousel", {
      modules: [Navigation],
      slidesPerView: 6,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".category-carousel-next",
        prevEl: ".category-carousel-prev",
      },
      breakpoints: {
        0: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        991: { slidesPerView: 4 },
        1500: { slidesPerView: 6 },
      },
    });

    return () => {
      if (swiper && swiper.destroy) {
        swiper.destroy();
      }
    };
  }, [categories]);

  // Click Handler to filter products
  const handleCategoryClick = (categoryName, e) => {
    e.preventDefault();
    
    if (categoryName === "all") {
      navigate("/products");
    } else {
      navigate(`/products?category=${categoryName}`);
    }

    // Show a professional, modern toast
    const friendlyName = categoryName === "all" ? "All Categories" : categoryName.replace("-", " ");
    toast.success(`Filtering by: ${friendlyName.toUpperCase()} `);
  };

  return (
    <>
      <section className="py-5 overflow-hidden">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header d-flex flex-wrap justify-content-between mb-5">
                <h2 className="section-title">Categories</h2>

                <div className="d-flex align-items-center">
                  <a 
                    href="#" 
                    className="btn-link text-decoration-none me-3"
                    onClick={(e) => handleCategoryClick("all", e)}
                  >
                    View All Categories →
                  </a>

                  <div className="swiper-buttons">
                    <button className="swiper-prev category-carousel-prev btn btn-yellow me-1">
                      ❮
                    </button>
                    <button className="swiper-next category-carousel-next btn btn-yellow">
                      ❯
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              {categories.length === 0 ? (
                <div className="text-center py-4 text-muted">Loading categories...</div>
              ) : (
                <div className="category-carousel swiper">
                  <div className="swiper-wrapper">
                    
                    {/* View All category slide */}
                    <a 
                      href="#" 
                      className="nav-link category-item swiper-slide"
                      onClick={(e) => handleCategoryClick("all", e)}
                    >
                      <img 
                        src="../src/assets/images/icon-vegetables-broccoli.png" 
                        alt="all" 
                        style={{ width: "45px", height: "45px", filter: "grayscale(100%)" }}
                      />
                      <h3 className="category-title text-capitalize">Show All</h3>
                    </a>

                    {categories.map((cat) => {
                      const iconSrc = categoryIcons[cat] || "../src/assets/images/icon-vegetables-broccoli.png";
                      return (
                        <a 
                          key={cat}
                          href="#" 
                          className="nav-link category-item swiper-slide"
                          onClick={(e) => handleCategoryClick(cat, e)}
                        >
                          <img src={iconSrc} alt={cat} style={{ width: "45px", height: "45px" }} />
                          <h3 className="category-title text-capitalize">{cat.replace("-", " ")}</h3>
                        </a>
                      );
                    })}

                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Category;