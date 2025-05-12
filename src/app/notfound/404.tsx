import Link from "next/link";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen text-center px-10 bg-black">
      <h1 className="text-white uppercase text-4xl sm:text-6xl md:text-[150px] tracking-wide mb-10">
        404
      </h1>
      <h2 className="text-white uppercase text-3xl sm:text-5xl md:text-6xl tracking-widest mb-3">
        Shouldn&apos;t you be in the gym?
      </h2>
      <p className="text-white text-lg mb-16">
        The page you are looking for does not exist. It might have been moved or
        deleted.
      </p>
      <Link
        href={"/"}
        className="bg-accent py-4 px-8 text-white uppercase font-bold tracking-widest text-sm"
      >
        Back to home
      </Link>
    </main>
  );
};

export default NotFound;
