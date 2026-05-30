import { useState, useEffect } from "react"
import type { Product } from "../types"
import { ShoppingCart, Star } from "lucide-react"
import { useCart } from "../context/CartContext"

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    const data: Product[] = [
      {
        _id: "1",
        name: "Nike Air Max",
        description: "Comfortable running shoes",
        price: 120,
        originalPrice: 150,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        category: "Shoes",
        unit: "pair",
        stock: 10,
        isOrganic: false,
        rating: 4.5,
        reviewCount: 120,
        discount: 20,
        createdAt: "2026-01-01",
      },
      {
        _id: "2",
        name: "Adidas Hoodie",
        description: "Warm streetwear hoodie",
        price: 80,
        originalPrice: 100,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        category: "Clothing",
        unit: "piece",
        stock: 15,
        isOrganic: false,
        rating: 4.2,
        reviewCount: 90,
        discount: 20,
        createdAt: "2026-01-02",
      },
      {
        _id: "3",
        name: "Street Cap",
        description: "Trendy street fashion cap",
        price: 45,
        originalPrice: 60,
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
        category: "Accessories",
        unit: "piece",
        stock: 30,
        isOrganic: false,
        rating: 4.0,
        reviewCount: 50,
        discount: 25,
        createdAt: "2026-01-03",
      },
      {
        _id: "4",
        name: "Classic Jacket",
        description: "Stylish winter jacket",
        price: 150,
        originalPrice: 180,
        image: "https://images.unsplash.com/photo-1520975958225-23f3a3f4b7d7?auto=format&fit=crop&w=800&q=80",
        category: "Clothing",
        unit: "piece",
        stock: 8,
        isOrganic: false,
        rating: 4.6,
        reviewCount: 200,
        discount: 15,
        createdAt: "2026-01-04",
      },
      {
        _id: "5",
        name: "Luxury Watch",
        description: "Premium wrist watch",
        price: 250,
        originalPrice: 300,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        category: "Accessories",
        unit: "piece",
        stock: 5,
        isOrganic: false,
        rating: 4.8,
        reviewCount: 320,
        discount: 17,
        createdAt: "2026-01-05",
      },
      {
        _id: "6",
        name: "Leather Bag",
        description: "High quality leather bag",
        price: 180,
        originalPrice: 220,
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        category: "Accessories",
        unit: "piece",
        stock: 12,
        isOrganic: false,
        rating: 4.4,
        reviewCount: 140,
        discount: 18,
        createdAt: "2026-01-06",
      },
      {
        _id: "7",
        name: "Running Shoes",
        description: "Lightweight sneakers",
        price: 130,
        originalPrice: 160,
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
        category: "Shoes",
        unit: "pair",
        stock: 20,
        isOrganic: false,
        rating: 4.3,
        reviewCount: 110,
        discount: 19,
        createdAt: "2026-01-07",
      },
      {
        _id: "8",
        name: "Denim Jacket",
        description: "Classic denim wear",
        price: 110,
        originalPrice: 140,
        image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80",
        category: "Clothing",
        unit: "piece",
        stock: 14,
        isOrganic: false,
        rating: 4.1,
        reviewCount: 85,
        discount: 21,
        createdAt: "2026-01-08",
      },
      {
        _id: "9",
        name: "Street Hoodie",
        description: "Urban hoodie",
        price: 75,
        originalPrice: 95,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
        category: "Clothing",
        unit: "piece",
        stock: 25,
        isOrganic: false,
        rating: 4.0,
        reviewCount: 60,
        discount: 21,
        createdAt: "2026-01-09",
      },
      {
        _id: "10",
        name: "Casual Shirt",
        description: "Comfortable everyday shirt",
        price: 60,
        originalPrice: 80,
        image: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80",
        category: "Clothing",
        unit: "piece",
        stock: 18,
        isOrganic: false,
        rating: 4.2,
        reviewCount: 70,
        discount: 25,
        createdAt: "2026-01-10",
      },
    ]

    setProducts(data)
  }, [])

  return (
    <div className="px-5 md:px-10 py-10">
      <h2 className="text-2xl font-bold mb-6">Popular Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 w-full">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="h-40 w-full bg-gray-100 overflow-hidden">
              <img
                src={product.image}
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
                <span>{product.rating}</span>
                <span className="text-gray-400">({product.reviewCount})</span>
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
    </div>
  )
}

export default PopularProducts