import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Images
import hero1 from "../assets/heroimg.avif";
import hero2 from "../assets/heroimg2.avif";
import hero3 from "../assets/heroimg3.webp";

const slides = [
  {
    image: hero1,
    badge: "✨ New Arrival",
    title: "Unisex Streetwear Essentials",
    desc: "Upgrade your wardrobe with bold, modern street fashion designed for everyday confidence.",
    tags: ["👕 Unisex", "👟 Streetwear", "💎 Premium"],
    button: "Shop Streetwear",
    link: "/products",
  },
  {
    image: hero2,
    badge: "🔥 Trending Now",
    title: "Modern Jackets Collection",
    desc: "Stay warm and stylish with our latest premium jackets for all seasons and all genders.",
    tags: ["🧥 Jackets", "❄️ Winter Ready", "⚡ Trendy"],
    button: "Explore Jackets",
    link: "/products",
  },
  {
    image: hero3,
    badge: "💫 Limited Drop",
    title: "Urban Fashion Collection",
    desc: "Minimal, clean, and powerful outfits built for modern urban lifestyle and expression.",
    tags: ["🧢 Urban", "👖 Casual Fit", "🔥 Limited"],
    button: "Shop Urban Wear",
    link: "/products",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const current = slides[index];

  return (
    <div className="w-full px-4 md:px-10 mt-6">
      <div className="relative w-full h-[560px] rounded-[40px] overflow-hidden shadow-2xl">

        {/* IMAGE SLIDER */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <img
              key={i}
              src={s.image}
              className="w-full h-full object-cover flex-shrink-0"
              alt={`slide-${i}`}
            />
          ))}
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/55" />

        {/* LEFT CONTENT */}
        <div className="absolute inset-0 flex items-center justify-start px-6 md:px-16">

          <div key={index} className="text-white max-w-xl space-y-6 animate-fadeIn">

            <span className="bg-green-900 px-4 py-1 rounded-full text-sm inline-block">
              {current.badge}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {current.title}
            </h1>

            <p className="text-gray-200 text-sm md:text-base">
              {current.desc}
            </p>

            {/* BUTTON WITH LINK */}
            <Link to={current.link}>
              <button className="bg-green-900 hover:bg-green-800 px-6 py-3 rounded-full font-semibold transition">
                {current.button}
              </button>
            </Link>

            <div className="flex gap-3 flex-wrap">
              {current.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/10 px-3 py-2 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;