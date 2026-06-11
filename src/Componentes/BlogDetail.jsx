import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        setBlog(res.data);
        
        const relatedRes = await axios.get('https://dummyjson.com/products?limit=3');
        setRelatedPosts(relatedRes.data.products);
      } catch (err) {
        console.log("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRelatedPostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleImageError = (e, fallbackUrl) => {
    e.target.onerror = null;
    e.target.src = fallbackUrl;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container py-5 text-center">
        <h2>Blog post not found</h2>
        <button className="btn btn-primary mt-3" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-primary mb-4" onClick={handleGoBack}>
        ← Back
      </button>

      <div className="row">
        {/* Main Blog Content */}
        <div className="col-lg-8">
          <article className="blog-detail">
            {/* Blog Image */}
            <div className="blog-image mb-4">
              <img
                src={blog.thumbnail || `https://picsum.photos/800/400?random=${blog.id}`}
                alt={blog.title}
                className="img-fluid rounded"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                onError={(e) => handleImageError(e, `https://dummyimage.com/800x400/0d6efd/fff.png&text=${encodeURIComponent(blog.title || "Blog+Image")}`)}
              />
            </div>

            {/* Blog Meta Info */}
            {/* <div className="blog-meta d-flex gap-4 mb-3">
              <span className="text-muted">
                <i className="bi bi-calendar me-2"></i>
                {blog.date || "March 15, 2024"}
              </span> */}
              {/* <span className="text-muted">
                <i className="bi bi-person me-2"></i>
                {blog.author || "Admin"}
              </span> */}
              {/* <span className="text-muted">
                <i className="bi bi-folder me-2"></i>
                {blog.category || "Food"}
              </span>
            </div> */}

            {/* Blog Title */}
            <h1 className="blog-title mb-4">{blog.title || "Blog Post Title"}</h1>

            {/* Blog Content */}
            <div className="blog-content">
              <p className="lead">{blog.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
              
              <h3 className="mt-4 mb-3">Section 1: Introduction</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <h3 className="mt-4 mb-3">Section 2: Main Content</h3>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
                mollit anim id est laborum.
              </p>

              <blockquote className="blockquote bg-light p-4 my-4 border-start border-primary border-4">
                <p className="mb-0">
                  "This is a sample quote from the blog post. It highlights an important point or customer testimonial."
                </p>
                <footer className="blockquote-footer mt-2">John Doe, <cite title="Source Title">Happy Customer</cite></footer>
              </blockquote>

              <h3 className="mt-4 mb-3">Section 3: Conclusion</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
                dicta sunt explicabo.
              </p>
            </div>

            {/* Tags */}
            {blog.tags && (
              <div className="blog-tags mt-4">
                <h5>Tags:</h5>
                <div className="d-flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="share-buttons mt-5">
              <h5>Share this article:</h5>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-facebook me-2"></i>Facebook
                </button>
                <button className="btn btn-outline-info">
                  <i className="bi bi-twitter me-2"></i>Twitter
                </button>
                <button className="btn btn-outline-success">
                  <i className="bi bi-whatsapp me-2"></i>WhatsApp
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-link me-2"></i>Copy Link
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Author Info */}
          <div >
            {/* <div className="text-center"> */}
              {/* <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author || "Admin")}&size=100&background=0d6efd&color=fff`}
                alt={blog.author || "Admin"}
                className="rounded-circle mb-3"
                width="100"
                height="100"
                onError={(e) => handleImageError(e, "https://picsum.photos/100/100?random=999")}
              /> */}
              {/* <h5>{blog.author || "Admin"}</h5>
              <p className="text-muted">Food Blogger & Recipe Developer</p>
              <p>
                Passionate about cooking and sharing delicious recipes with the world.
              </p> */}
            {/* </div> */}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="related-posts card p-4">
              <h5 className="mb-3">Related Posts</h5>
              {relatedPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="related-post-item d-flex gap-3 mb-3 cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRelatedPostClick(post.id)}
                >
                  <img
                    src={post.thumbnail || `https://picsum.photos/70/70?random=${post.id}`}
                    alt={post.title}
                    width="70"
                    height="70"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => handleImageError(e, "https://dummyimage.com/70x70/6c757d/fff.png&text=img")}
                  />
                  <div>
                    <h6 className="mb-1">{post.title}</h6>
                    <small className="text-muted">March 15, 2024</small>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Categories */}
          {/* <div className="categories-card card p-4 mt-4">
            <h5 className="mb-3">Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none">Fruits (12)</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none">Vegetables (8)</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none">Juices (5)</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none">Organic (3)</a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section mt-5">
        <h3 className="mb-4">Comments (3)</h3>
        
        {/* Comment Form */}
        <div className="comment-form card p-4 mb-4">
          <h5>Leave a Comment</h5>
          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input type="text" className="form-control" placeholder="Your Name" />
              </div>
              <div className="col-md-6 mb-3">
                <input type="email" className="form-control" placeholder="Your Email" />
              </div>
              <div className="col-12 mb-3">
                <textarea className="form-control" rows="4" placeholder="Your Comment"></textarea>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">Post Comment</button>
              </div>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          <div className="comment-item card p-3 mb-3">
            <div className="d-flex gap-3">
              <img 
                src="https://ui-avatars.com/api/?name=John+Doe&size=50&background=0d6efd&color=fff" 
                alt="John Doe" 
                className="rounded-circle" 
                width="50" 
                height="50" 
              />
              <div>
                <h6 className="mb-1">John Doe</h6>
                <small className="text-muted">March 15, 2024</small>
                <p className="mt-2">Great article! Very informative and helpful.</p>
              </div>
            </div>
          </div>
          <div className="comment-item card p-3 mb-3">
            <div className="d-flex gap-3">
              <img 
                src="https://ui-avatars.com/api/?name=Jane+Smith&size=50&background=198754&color=fff" 
                alt="Jane Smith" 
                className="rounded-circle" 
                width="50" 
                height="50" 
              />
              <div>
                <h6 className="mb-1">Jane Smith</h6>
                <small className="text-muted">March 14, 2024</small>
                <p className="mt-2">Thanks for sharing this. Looking forward to more content!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;