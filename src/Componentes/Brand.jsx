import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByBrand } from "../Servise/Products";

const Brand = () => {
  const { name } = useParams(); 

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductsByBrand(name);
      setProducts(data);
    };

    fetchData();
  }, [name]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{name} Products</h2>

      {products.length === 0 ? (
        <p>No Products Found</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {products.map((item) => (
            <div key={item.id} style={{ border: "1px solid #ddd", padding: "10px", width: "200px" }}>
              <img src={item.thumbnail} alt={item.title} style={{ width: "100%" }} />
              <h4>{item.title}</h4>
              <p>₹ {item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brand;