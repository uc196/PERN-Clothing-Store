import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Classic White T-Shirt",
    description: "Soft cotton t-shirt for everyday casual wear.",
    price: 8500,
    originalPrice: 10000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    category: "Tops",
    unit: "piece",
    stock: 120,
    isOrganic: false,
    rating: 4.7,
    reviewCount: 58,
  },
  {
    name: "Blue Denim Jeans",
    description: "Slim-fit denim jeans with a modern streetwear look.",
    price: 18500,
    originalPrice: 22000,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    category: "Bottoms",
    unit: "piece",
    stock: 80,
    isOrganic: false,
    rating: 4.8,
    reviewCount: 74,
  },
  {
    name: "Black Hoodie",
    description: "Warm pullover hoodie made for comfort and layering.",
    price: 22000,
    originalPrice: 25000,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    category: "Outerwear",
    unit: "piece",
    stock: 60,
    isOrganic: false,
    rating: 4.9,
    reviewCount: 91,
  },
  {
    name: "Red Casual Dress",
    description: "Elegant casual dress suitable for outings and events.",
    price: 26000,
    originalPrice: 30000,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    category: "Dresses",
    unit: "piece",
    stock: 45,
    isOrganic: false,
    rating: 4.6,
    reviewCount: 39,
  },
  {
    name: "Men's Formal Shirt",
    description: "Sharp long-sleeve shirt for office and formal occasions.",
    price: 15000,
    originalPrice: 17500,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
    category: "Shirts",
    unit: "piece",
    stock: 70,
    isOrganic: false,
    rating: 4.5,
    reviewCount: 28,
  },
  {
    name: "Women's Sneakers",
    description: "Comfortable everyday sneakers with a clean finish.",
    price: 24000,
    originalPrice: 28000,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    category: "Footwear",
    unit: "pair",
    stock: 55,
    isOrganic: false,
    rating: 4.8,
    reviewCount: 66,
  },
  {
    name: "Brown Leather Belt",
    description: "Durable leather belt that pairs well with formal wear.",
    price: 7000,
    originalPrice: 9000,
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    unit: "piece",
    stock: 150,
    isOrganic: false,
    rating: 4.4,
    reviewCount: 21,
  },
  {
    name: "Pink Skirt",
    description: "Lightweight skirt for stylish casual and semi-formal looks.",
    price: 13500,
    originalPrice: 16000,
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a13d85?auto=format&fit=crop&w=800&q=80",
    category: "Bottoms",
    unit: "piece",
    stock: 50,
    isOrganic: false,
    rating: 4.6,
    reviewCount: 33,
  },
  {
    name: "Kids Polo Shirt",
    description: "Breathable polo shirt designed for children.",
    price: 9500,
    originalPrice: 11000,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    category: "Kids Wear",
    unit: "piece",
    stock: 90,
    isOrganic: false,
    rating: 4.7,
    reviewCount: 25,
  },
  {
    name: "Winter Jacket",
    description: "Thick jacket for cold weather and outdoor comfort.",
    price: 32000,
    originalPrice: 38000,
    image:
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=800&q=80",
    category: "Outerwear",
    unit: "piece",
    stock: 35,
    isOrganic: false,
    rating: 4.9,
    reviewCount: 47,
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing products
  await prisma.product.deleteMany();

  // Seed products
  await prisma.product.createMany({
    data: products,
  });

  const count = await prisma.product.count();

  console.log(`✅ Successfully seeded ${count} products.`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed!");
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });