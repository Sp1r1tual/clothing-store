import { ScrollTo } from "@/components/ui/ScrollTo/ScrollTo";
import { ScrollToTop } from "@/components/ui/ScrollToTop/ScrollToTop";
import { SectionDots } from "@/components/ui/SectionDots/SectionDots";

import { AboutBrand } from "./_components/AboutBrand/AboutBrand";
import { CatalogCTA } from "./_components/CatalogCTA/CatalogCTA";
import { DeliveryPartners } from "./_components/DeliveryPartners/DeliveryPartners";
import { Hero } from "./_components/Hero/Hero";
import { PopularCategories } from "./_components/PopularCategories/PopularCategories";

export const Landing = () => {
  return (
    <>
      <SectionDots />
      <ScrollTo />
      <ScrollToTop />
      <Hero />
      <PopularCategories />
      <AboutBrand />
      <DeliveryPartners />
      <CatalogCTA />
    </>
  );
};
