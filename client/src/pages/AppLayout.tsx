import { useState, useEffect } from "react"
import { Outlet, useOutletContext } from "react-router-dom"
import type { Product } from "../types"
import Banner from "../components/Banner"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import CartSider from "../components/CardSider"

type ShopContext = {
  products: Product[]
  loading: boolean
}

const allowedCategories = ["men's clothing", "women's clothing", "tops", "shirts", "womens-dresses"]

const mapFakeStore = (item: any): Product => ({
  _id: "fs-" + item.id,
  name: item.title,
  description: item.description,
  price: item.price,
  originalPrice: item.price + item.price * 0.2,
  image: item.image,
  category: item.category,
  unit: "piece",
  stock: 10,
  isOrganic: false,
  rating: item.rating?.rate || 0,
  reviewCount: item.rating?.count || 0,
  discount: 20,
  createdAt: new Date().toISOString(),
})

const mapDummyJSON = (item: any): Product => ({
  _id: "dj-" + item.id,
  name: item.title,
  description: item.description,
  price: item.price,
  originalPrice: item.price + item.price * 0.2,
  image: item.thumbnail,
  category: item.category,
  unit: "piece",
  stock: item.stock,
  isOrganic: false,
  rating: item.rating,
  reviewCount: item.stock,
  discount: 10,
  createdAt: new Date().toISOString(),
})

const AppLayout = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const [fakeRes, dummyRes] = await Promise.all([
          fetch("https://fakestoreapi.com/products"),
          fetch("https://dummyjson.com/products?limit=100"),
        ])
        const fakeData = await fakeRes.json()
        const dummyData = await dummyRes.json()

        const merged = [
          ...fakeData.map(mapFakeStore).filter((p: Product) =>
            allowedCategories.includes(p.category)
          ),
          ...dummyData.products.map(mapDummyJSON),
        ]
        setProducts(merged)
      } catch (err) {
        console.log("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <>
      <Banner />
      <NavBar />
      <CartSider />
      <main className="min-h-screen">
        <Outlet context={{ products, loading } satisfies ShopContext} />
      </main>
      <Footer />
    </>
  )
}

export const useShopContext = () => useOutletContext<ShopContext>()
export default AppLayout