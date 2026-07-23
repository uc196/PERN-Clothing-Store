import { useState, useEffect } from "react"
import { Outlet, useOutletContext } from "react-router-dom"
import type { Product } from "../types"
import Banner from "../components/Banner"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import CartSider from "../components/CardSider"
import api from "../config/api" // 👈 1. Import your custom api configuration instance

type ShopContext = {
  products: Product[]
  loading: boolean
}

const AppLayout = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // 2. Swap standard fetch out for your axios api instance
        const response = await api.get("/api/products")
        
        // 3. Axios automatically processes response JSON inside the .data property
        setProducts(response.data)
      } catch (err) {
        console.error("Database fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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