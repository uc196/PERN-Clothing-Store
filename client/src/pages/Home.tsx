import AppPromoBanner from "../components/AppPromoBanner"
import Features from "../components/Features"
import Hero from "../components/Hero"
import HomeCategories from "../components/HomeCategories"
import NewsLetter from "../components/NewsLetter"
import PopularProducts from "../components/PopularProducts"

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      <HomeCategories />
      <PopularProducts />
      <AppPromoBanner />
      <NewsLetter />
    </div>
  )
}

export default Home
