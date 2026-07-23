import { useState, useEffect } from "react";
import type { Product } from "../types";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../config/api";

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products/getProducts?limit=10&sort=rating');
      
      // ✅ FIX: Extract .products from response.data (or fallback if it's already an array)
      const productArray = response.data.products || response.data;
      setProducts(Array.isArray(productArray) ? productArray : []);
    } catch (error) {
      console.error("Error fetching products from database:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  if (loading) {
    return (
      <div className="px-5 md:px-10 py-10 text-center text-gray-500">
        Loading products from database...
      </div>
    );
  }

  return (
    <div className="px-5 md:px-10 py-10">
      <h2 className="text-2xl font-bold mb-6">Popular Products</h2>

      {products.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No products found in the database.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 w-full">
          {products.map((product) => (
            <div
              key={product.id || product._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-40 w-full bg-gray-100 overflow-hidden">
                <img
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-sm">{product.name}</h3>

                <p className="text-gray-500 text-xs line-clamp-1">
                  {product.description}
                </p>

                <div className="flex items-center gap-1 text-xs mt-1">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span>{product.rating || 5}</span>
                  <span className="text-gray-400">({product.reviewCount || 0})</span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-green-950 text-white py-2 rounded-lg text-sm hover:bg-black"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularProducts;