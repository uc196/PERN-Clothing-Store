import { useMemo, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useShopContext } from "./AppLayout"
import { ShoppingCart } from "lucide-react"

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()
  const { products, loading } = useShopContext()
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [maxPrice, setMaxPrice] = useState(1000)

  const category = searchParams.get("category") || "all"

  const allowedCategories = [
    "men's clothing",
    "women's clothing",
    "tops",
    "shirts",
    "womens-dresses",
  ]

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = category === "all" || p.category === category
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchPrice = p.price <= maxPrice
      return matchCategory && matchSearch && matchPrice
    })
  }, [products, category, search, maxPrice])

  const setCategory = (cat: string) => {
    setSearchParams({ category: cat })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-4 hidden md:block">
        <h2 className="font-bold text-lg mb-4">Filters</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border rounded p-2 mb-4"
        />
        <div className="mb-4">
          <p className="font-semibold mb-2">Category</p>
          <button
            onClick={() => setCategory("all")}
            className={`block w-full text-left p-2 rounded ${
              category === "all" ? "bg-amber-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {allowedCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`block w-full text-left p-2 mt-1 rounded ${
                category === cat ? "bg-amber-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div>
          <p className="font-semibold mb-2">Max Price</p>
          <input
            type="range" min="0" max="1000" value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm mt-2">Up to ₦{maxPrice}</p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-6">Fashion Store</h1>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-52 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/products/${p._id}`)}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-black transition-all duration-300 cursor-pointer"
              >
                <div className="h-44 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-3">
                  <h2 className="font-semibold text-sm line-clamp-1">{p.name}</h2>
                  <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                  <p className="font-bold mt-2">₦{p.price}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(p) }}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-amber-600 text-white py-2 rounded-lg hover:bg-green-900 active:scale-95 transition"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-lg font-semibold">No products found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductPage