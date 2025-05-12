import React from "react";
import Image from "next/image";
import Link from "next/link";
import pricingImg from "../../../public/pricing-img.jpg";
import QuoteSection from "../components/QuoteSection";
import PricingPlans from "../components/PricingPlans";

const Pricing: React.FC = () => {
  return (
    <main className="w-full bg-[#FBFBFB]">
      <div className="relative top-16 md:top-0">
        <Image
          src={pricingImg}
          alt="Barbell with eight weight plates"
          placeholder="blur"
          className="w-full h-[220px] md:h-auto max-w-full"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="absolute top-[50%] left-[50%] translate-x-[-50%] md:left-[30%] lg:left-[25%] text-white uppercase text-4xl sm:text-6xl md:text-8xl tracking-wide">
          Pricing
        </h1>
      </div>

      <section className="py-40 px-10 w-full">
        <div className="flex flex-col justify-center items-center md:items-stretch max-w-[1240px] mx-auto">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-center items-center gap-4 lg:gap-0 w-full">
            <h2 className="text-[#29282D] text-5xl uppercase tracking-wide w-full md:w-[40%] lg:w-[30%]">
              Choose your pricing plan
            </h2>
            <Link
              href={"/contact"}
              className="bg-accent py-4 px-8 text-white uppercase font-bold tracking-widest text-sm md:ml-auto"
            >
              Join now
            </Link>
          </div>
          <PricingPlans />
        </div>
      </section>
      <QuoteSection />
    </main>
  );
};

export default Pricing;
