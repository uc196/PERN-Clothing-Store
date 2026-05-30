import { Toaster } from "react-hot-toast"
import { Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"

import Login from "./pages/Login"
import AppLayout from "./pages/AppLayout"
import Home from "./pages/Home"
import Product from "./pages/Product"
import ProductPage from "./pages/ProductPage"
import SearchResults from "./pages/SearchResults"
import FlashDeals from "./pages/FlashDeals"
import Check from "./pages/Check"
import Myorders from "./pages/Myorders"
import OrderTracking from "./pages/OrderTracking"
import Addresses from "./pages/Addresses"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLayout from "./admin/AdminLayout"
import AdminDashboard from "./admin/AdminDashboard"
import AdminProducts from "./admin/AdminProducts"
import AdminProductForm from "./admin/AdminProductForm"
import AdminOrders from "./admin/AdminOrders"
import AdminDeliveryPartners from "./admin/AdminDeliveryPartners"
import DeliveryLogin from "./delivery/DeliveryLogin"
import DeliveryLayout from "./delivery/DeliveryLayout"

const App = () => {
  return (
    <CartProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#183022",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Product />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="deals" element={<FlashDeals />} />

          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Check />} />
            <Route path="orders" element={<Myorders />} />
            <Route path="orders/:id" element={<OrderTracking />} />
            <Route path="addresses" element={<Addresses />} />
          </Route>
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
         <Route index element={<AdminDashboard />} />
         <Route path='products' element={<AdminProducts />} />
                <Route path='products/new' element={<AdminProductForm />} />
                <Route path='products/:id/edit' element={<AdminProductForm />} />
                        <Route path='orders' element={<AdminOrders />} />
                                <Route path='delivery-partners' element={<AdminDeliveryPartners />} />


        </Route>
        <Route path='/delivery/login' element={<DeliveryLogin />} />
        <Route path ='/delivery' element={<DeliveryLayout />} >
        <Route index element={<DeliveryLogin />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App