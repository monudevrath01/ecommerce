// src/pages/Blog.jsx
import React, { useEffect, useState } from "react";
import { getBlogs  } from "../Servise/Products";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBlogs();
      setBlogs(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2> Blog Page</h2>

      {blogs.length === 0 ? (
        <p>No Blogs Found</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {blogs.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                width: "250px",
              }}
            >
             
              <img
                src={`https://picsum.photos/300/200?random=${item.id}`}
                alt="blog"
                style={{ width: "100%" }}
              />

              <h4>{item.title}</h4>

              <p>
                {item.body.substring(0, 80)}...
              </p>

              <p>
                {item.reactions} <br />
                👁 {item.views}
              </p>

              <div>
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      background: "#eee",
                      padding: "3px 6px",
                      marginRight: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;