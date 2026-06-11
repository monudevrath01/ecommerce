import React, { useEffect, useState } from "react";
import { getProducts } from "../Servise/Products";
import { useNavigate } from "react-router-dom"; // Add this import

const OurRecentBlog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate(); // Add navigate hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts(3);
        console.log("Fetched products:", data);
        setBlogPosts(data);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle blog post click
  const handleBlogPostClick = (postId, e) => {
    e.preventDefault();
    navigate(`/blog/${postId}`); // Navigate to blog detail page
  };

  // Handle read more click
  const handleReadMoreClick = (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/blog/${postId}`);
  };

  // Handle read all articles click
  const handleReadAllClick = (e) => {
    e.preventDefault();
    navigate('/blog'); // Navigate to all blog posts page
  };

  // Handle product click (if you want to keep product navigation)
  const handleProductClick = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  // Loading state
  if (loading) {
    return (
      <section id="latest-blog" className="py-5">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="latest-blog" className="py-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="section-header d-flex align-items-center justify-content-between my-5">
              <h2 className="section-title">Our Recent Blog</h2>
              <div className="btn-wrap align-right">
                <a 
                  href="#" 
                  className="d-flex align-items-center nav-link"
                  onClick={handleReadAllClick}
                >
                  Read All Articles{" "}
                  <svg width={24} height={24}>
                    <use xlinkHref="#arrow-right" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          {blogPosts && blogPosts.map((post) => (
            <div className="col-md-4" key={post.id}>
              <article 
                className="post-item card border-0 shadow-sm p-3 h-100"
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleBlogPostClick(post.id, e)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                }}
              >
                <div className="image-holder zoom-effect" style={{ overflow: 'hidden', borderRadius: '8px' }}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBlogPostClick(post.id, e);
                    }}
                  >
                    <img
                      src={post.thumbnail}
                      alt="product"
                      className="card-img-top"
                      style={{ 
                        width: '100%', 
                        height: '250px', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </a>
                </div>
                <div className="card-body px-0">
                  <div className="post-meta d-flex text-uppercase gap-3 my-2 align-items-center">
                    <div className="meta-date d-flex align-items-center gap-1">
                      <svg width={16} height={16}>
                        <use xlinkHref="#calendar" />
                      </svg>
                      {post.date || "March 15, 2024"}
                    </div>
                    <div className="meta-categories d-flex align-items-center gap-1">
                      <svg width={16} height={16}>
                        <use xlinkHref="#category" />
                      </svg>
                      {post.category || "Food"}
                    </div>
                  </div>
                  <div className="post-header">
                    <h3 className="post-title">
                      <a 
                        href="#" 
                        className="text-decoration-none text-dark"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleBlogPostClick(post.id, e);
                        }}
                      >
                        {post.title || "Blog Post Title"}
                      </a>
                    </h3>
                    <p className="text-secondary">
                      {post.excerpt || post.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."}
                    </p>
                    <a 
                      href="#" 
                      className="btn btn-link text-primary p-0"
                      onClick={(e) => handleReadMoreClick(post.id, e)}
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Optional: Display products section if needed */}
        {products.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="mb-4">Related Products</h3>
              <div className="row g-4">
                {products.slice(0, 3).map((product) => (
                  <div className="col-md-4" key={product.id}>
                    <div 
                      className="card p-3 h-100"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleProductClick(product.id, e)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <h4>{product.title}</h4>
                      <p className="text-primary fw-bold">${product.price}</p>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleProductClick(product.id, e);
                        }}
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .zoom-effect:hover img {
          transform: scale(1.05);
        }
        .post-title a:hover {
          color: #0d6efd !important;
        }
        .post-item {
          transition: box-shadow 0.3s ease;
        }
      `}</style>
    </section>
  );
};

export default OurRecentBlog;