import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./Layout/MainLayout";
import AdminLayout from "./Layout/AdminLayout";

import Home from "./pages/Home";
import Men from "./pages/Men";
import Shop from "./pages/Shop";
import Kids from "./pages/Kids";
import Women from "./pages/Women";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";


import AdminProducts from "./Admin/Pages/AdminProducts";
import AdminOrder from "./Admin/Pages/AdminOrders.jsx";
import AdminReturnRequest from "./Admin/Pages/AdminReturnRequest";
import AdminUsers from "./Admin/Pages/AdminUser";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/men" element={<Men />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/women" element={<Women />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile" element={<Profile />} />
        
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
        
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrder />} />
          <Route path="return-requests" element={<AdminReturnRequest />} />
          <Route path="users" element={<AdminUsers />} />
          
        </Route>

      

       


      </Routes>
    </BrowserRouter>
  );
}

export default App;
