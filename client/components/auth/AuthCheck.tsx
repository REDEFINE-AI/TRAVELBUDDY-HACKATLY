"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import axiosInstance from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";

export function AuthCheck() {
  const { setUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null;
    const publicPaths = [
      "/",
      "/home",
      "/landing",
      "/signup",
      "/login",
      "/welcome",
      "/trip-planner",
      "/trip-planner/itinerary",
    ];
    const isPublicPath = publicPaths.includes(pathname);

    const fetchUserData = async () => {
      if (!token) {
        if (!isPublicPath) {
          router.push("/login");
        }
        return;
      }

      try {
        const response = await axiosInstance.get("/profile/me");

        setUser(response.data);
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);

        // Clear auth state and redirect on error
        logout();
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        if (!isPublicPath) {
          router.push("/login");
        }
      }
    };

    fetchUserData();
  }, [setUser, logout, pathname, router]);

  return null;
}
