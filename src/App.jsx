import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Componentes/HomePage";
import Woman from "./Componentes/Woman";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Men from "./Componentes/Man"
import Kids from "./Componentes/Kids";
import Accessories from "./Componentes/Accessories";
import Brand from "./Componentes/Brand";
import Sale from "./Componentes/Sale";
import Blog from "./Componentes/Blog";
import Login from "./Componentes/Login";
import Account from "./Componentes/Acount";
import ProductDetail from "./Componentes/Detail";
import BlogDetail from "./Componentes/BlogDetail";
import AddToCart from "./Componentes/AddToCart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import OrdersHistory from "./Componentes/OrdersHistory";
import AdminDashboard from "./Componentes/AdminDashboard";
import Wishlist from "./Componentes/Wishlist";
import ProductsList from "./Componentes/ProductsList";
// import NotFound from "./Componentes/NotFound";


function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>

        <Route path="/login" element={<><Header /><Login /><Footer /></>} />
        <Route path="/" element={<HomePage />} />
        <Route path="/woman" element={<><Header /><Woman /><Footer /></>} />
        <Route path="/men" element={<><Header /><Men /><Footer /></>} />
        <Route path="/kids" element={<><Header /><Kids /><Footer /></>} />
        <Route path="/accessories" element={<><Header /><Accessories /><Footer /></>} />
        <Route path="/brand" element={<><Header /><Brand /><Footer /></>} />
        <Route path="/sale" element={<><Header /><Sale /><Footer /></>} />
        <Route path="/blog" element={<><Header /><Blog /><Footer /></>} />
        <Route path="/account" element={<><Header /><Account /><Footer /></>} />
        <Route path="/product/:id" element={<><Header /><ProductDetail /><Footer /></>} />
        <Route path="/blog/:id" element={<><Header /><BlogDetail /><Footer /></>} />
        <Route path="/cart" element={<><Header /><AddToCart /><Footer /></>} />
        <Route path="/orders" element={<><Header /><OrdersHistory /> <Footer /></>} />
        <Route path="/admin" element={<><Header /><AdminDashboard /><Footer /></>} />
        <Route path="/wishlist" element={<><Header /><Wishlist /><Footer /></>} />
        <Route path="/products" element={<><Header /><ProductsList /><Footer /></>} />
          {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;