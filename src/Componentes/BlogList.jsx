// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const BlogList = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get('https://dummyjson.com/products?limit=6');
//         setPosts(res.data.products);
//       } catch (err) {
//         console.log("Error fetching posts:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const handlePostClick = (postId) => {
//     navigate(`/blog/${postId}`);
//   };

//   const handleImageError = (e, postId, title) => {
//     e.target.onerror = null;
//     e.target.src = `https://picsum.photos/300/200?random=${postId}`;
//   };

//   if (loading) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-5">
//       <h1 className="text-center mb-5">Our Blog</h1>
      
//       <div className="row">
//         {posts.map((post) => (
//           <div className="col-md-4 mb-4" key={post.id}>
//             <div 
//               className="card h-100 shadow-sm"
//               style={{ cursor: 'pointer' }}
//               onClick={() => handlePostClick(post.id)}
//             >
//               <img
//                 src={post.thumbnail || `https://picsum.photos/300/200?random=${post.id}`}
//                 className="card-img-top"
//                 alt={post.title}
//                 style={{ height: '200px', objectFit: 'cover' }}
//                 onError={(e) => handleImageError(e, post.id, post.title)}
//               />
//               <div className="card-body">
//                 <div className="d-flex gap-2 mb-2">
//                   <small className="text-muted">
//                     <i className="bi bi-calendar me-1"></i>March 15, 2024
//                   </small>
//                   <small className="text-muted">
//                     <i className="bi bi-folder me-1"></i>Food
//                   </small>
//                 </div>
//                 <h5 className="card-title">{post.title}</h5>
//                 <p className="card-text">{post.description.substring(0, 100)}...</p>
//                 <button className="btn btn-primary btn-sm">Read More</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BlogList;