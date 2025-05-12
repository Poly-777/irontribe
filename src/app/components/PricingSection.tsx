'use client';

import React from 'react';
import Link from 'next/link';
import PricingPlans from '../components/PricingPlans';

export default function Pricing() {
  return (
    <section className="py-40 bg-[#111111] px-10 w-full">
      <div className="flex flex-col justify-center items-center md:items-stretch max-w-[1240px] mx-auto">
        <div className="text-center md:text-left flex flex-col md:flex-row justify-center items-center gap-4 lg:gap-0 w-full">
          <h2 className="text-white text-5xl uppercase tracking-wide w-full md:w-[35%] lg:w-[25%]">
            Our pricing plans
          </h2>
          <Link
            href="/pricing"
            className="bg-accent py-4 px-8 text-white uppercase font-bold tracking-widest text-sm md:ml-auto"
          >
            Learn more
          </Link>
        </div>
        <PricingPlans />
      </div>
    </section>
  );
}