import { Link } from "react-router-dom"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const categories = [
  {
    name: "men's clothing",
    category: "men's clothing",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "women's clothing",
    category: "women's clothing",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "men's clothing",
    category: "men's clothing",
    img: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "women's clothing",
    category: "women's clothing",
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
  }
]

const HomeCategories = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const amount = 260

    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <div className="w-full px-4 md:px-10 mt-10">

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Browse Categories
      </h2>

      {/* MOBILE SLIDER */}
      <div className="relative md:hidden">

        {/* LEFT BUTTON */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
          aria-label="Scroll left"
        >
          <ChevronLeft />
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2"
        >
          {categories.map((item, index) => (
            <Link
              key={index}
              to={`/products?category=${encodeURIComponent(item.category)}`}
              className="min-w-[240px] snap-start relative overflow-hidden rounded-2xl shadow-sm bg-white"
            >
              <div className="h-32 w-full overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <p className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* RIGHT BUTTON */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
          aria-label="Scroll right"
        >
          <ChevronRight />
        </button>

      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((item, index) => (
          <Link
            key={index}
            to={`/products?category=${encodeURIComponent(item.category)}`}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition"
          >
            <div className="h-44 w-full overflow-hidden">
              <img
                src={item.img}
                alt={item.name}
                className="h-full w-full object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition">
              <p className="text-white font-semibold text-sm bg-black/60 px-4 py-2 rounded-full">
                {item.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default HomeCategories