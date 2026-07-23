import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  ShoppingCart,
  LogOut,
  Package,
  MapPin,
  ShoppingBag,
  Settings,
  Menu,
  X,
  LayoutDashboard
} from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/authcontext"

const NavBar = () => {
  const navigate = useNavigate()

  const { cartCount, setIsCartOpen } = useCart()

const { user, logout, isAuthenticated } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setMobileMenuOpen(false)
    }
  }

const handleLogout = () => {
  logout();
  setUserMenuOpen(false);
  setMobileMenuOpen(false);
  navigate("/");
};

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase()

  return (
    <div className="w-full bg-white shadow-md px-5 md:px-10 py-3 flex items-center justify-between sticky top-0 z-50">

      {/* LOGO */}
      <Link to="/" className="text-2xl font-bold">
        InstaWear
      </Link>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-10 text-sm text-gray-600">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/deals" className="text-green-900">Deals</Link>
      </div>

      {/* SEARCH */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full w-64"
      >
        <Search size={18} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />
      </form>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* CART BUTTON (FIXED) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative"
          aria-label="Open cart"
        >
          <ShoppingCart size={22} />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        </button>

        {/* USER */}
      <div className="hidden md:block relative">
  {isAuthenticated && user ? (
    <>
      <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold"
      >
        {getInitial(user.name)}
      </button>

      {userMenuOpen && (
        <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border overflow-hidden z-50">

          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <Settings size={18} />
            Profile
          </Link>

          <Link
            to="/orders"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <Package size={18} />
            Orders
          </Link>

          <Link
            to="/addresses"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <MapPin size={18} />
            Addresses
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <ShoppingBag size={18} />
            Cart
          </Link>

         {user?.isAdmin && (
    <Link
        to="/admin" 
        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
    >
        <LayoutDashboard className="size-4" />
        Admin Panel
    </Link>
)}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </>
  ) : (
    <Link
      to="/login"
      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
    >
      Sign In
    </Link>
  )}
</div>

        {/* MOBILE MENU */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col gap-4 p-5 md:hidden z-50">

          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/deals">Deals</Link>

          {/* CART BUTTON (MOBILE FIX) */}
          <button
            onClick={() => {
              setIsCartOpen(true)
              setMobileMenuOpen(false)
            }}
          >
            Cart
          </button>

        </div>
      )}
    </div>
  )
}

export default NavBar