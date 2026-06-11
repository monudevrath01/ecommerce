import React, { useEffect, useState } from "react";
import { getSaleProducts } from "../Servise/Products";

const Sale = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSaleProducts();
      setProducts(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2> Sale Products</h2>

      {products.length === 0 ? (
        <p>No Sale Products</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {products.map((item) => (
            <div key={item.id} style={{ border: "1px solid #ddd", padding: "10px", width: "200px" }}>
              <img src={item.thumbnail} alt={item.title} style={{ width: "100%" }} />
              <h4>{item.title}</h4>

              <p>
                ₹ {item.price} <br />
                <span style={{ color: "red" }}>
                  {item.discountPercentage}% OFF
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sale;