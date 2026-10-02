'use client'
import HeroBanner from "@/contents/home/hero/HeroBanner";
import MarqueeBanner from "@/contents/home/marquee/MarqueeBanner";
import CategoryShowcase from "@/contents/home/categories/CategoryShowcase";
import FeaturedProducts from "@/contents/home/featured/FeaturedProducts";
import PromoBanner from "@/contents/home/promo/PromoBanner";
import TrendingSection from "@/contents/home/trending/TrendingSection";
import Newsletter from "@/contents/home/newsletter/Newsletter";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <MarqueeBanner />
      <CategoryShowcase />
      <PromoBanner />
      <FeaturedProducts />
      <TrendingSection />
      <Newsletter />
    </main>
  );
}
