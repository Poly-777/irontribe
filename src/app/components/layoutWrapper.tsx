"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const noNavbarRoutes = ["/login", "/signup","/admin-login","/admin-dashboard"];
  const showNavbar = !noNavbarRoutes.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
