import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useShopContext } from "./AppLayout"
import type { Product } from "../types"
import { ShoppingCart, ArrowLeft, Star } from "lucide-react"

const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₦"

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ))}
    <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)}</span>
  </div>
)

const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { products } = useShopContext()

  const [product, setProduct] = useState<Product | null>(null)
  const [featured, setFeatured] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  
useEffect(() => {
  const loadProduct = async () => {
    setLoading(true);

    // 1. Check if the product is already loaded in your global layout context
    const found = products.find((p) => p.id === id || p._id === id);
    if (found) {
      setProduct(found);
      setFeatured(products.filter((p) => p.id !== id && p._id !== id).slice(0, 5));
      setLoading(false);
      return;
    }

    // 2. Fetch directly from your local database API endpoint only
    try {
      const dbResponse = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!dbResponse.ok) {
        throw new Error("Product not found in database");
      }
      
      const dbData = await dbResponse.json();
      setProduct(dbData);
      setFeatured(products.filter((p) => p.id !== id && p._id !== id).slice(0, 5));
    } catch (err) {
      console.error("Database fetch error:", err);
      setProduct(null); // Triggers the "Product not found" UI layout safely
    } finally {
      setLoading(false);
    }
  };

  if (id) loadProduct();
}, [id, products]);
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-2 gap-10">
        <div className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 animate-pulse rounded-lg w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">Product not found</p>
        <button onClick={() => navigate("/products")} className="bg-black text-white px-6 py-2 rounded-lg">
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-5 py-8">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6 transition">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 grid md:grid-cols-2 gap-10 p-8">

          {/* IMAGE */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6 h-96">
            <img src={product.image} alt={product.name} className="h-full object-contain" />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">{product.category}</span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-3">{product.name}</h1>
              <StarRating rating={product.rating} />
              <p className="text-sm text-gray-500 mt-1 mb-4">{product.reviewCount} reviews</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-extrabold text-gray-900">{currency}{product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-lg">{currency}{product.originalPrice.toFixed(0)}</span>
                )}
                {product.discount && (
                  <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              <p className={`text-sm mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg hover:bg-gray-100 transition">−</button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2 text-lg hover:bg-gray-100 transition">+</button>
              </div>
              <button
                onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product) }}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl hover:bg-green-900 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-5">Customer Reviews</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Customer {i + 1}</p>
                    <StarRating rating={Math.max(3, product.rating - i * 0.2)} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-3">
                  {["Great product! Exactly as described and arrived quickly.",
                    "Good quality for the price. Would definitely buy again.",
                    "Nice item, fits well. The material feels premium.",
                    "Decent purchase overall. Delivery was fast too.",
                    "Satisfied with this product. Matches the photos perfectly."][i]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED */}
        {featured.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-5">Featured Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {featured.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/products/${p._id}`)}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-black transition-all duration-300 cursor-pointer"
                >
                  <div className="h-36 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-semibold line-clamp-1">{p.name}</h3>
                    <p className="text-sm font-bold mt-1">{currency}{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProductPage