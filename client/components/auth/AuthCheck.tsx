"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";

export function AuthCheck() {
  const { setUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      const user_id = await document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_id="))
        ?.split("=")[1] || null;

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

      if (!loading) return;

      const fetchUserData = async () => {
        try {
          if (!user_id) {
            if (!isPublicPath) {
              router.push("/login");
            }
            setLoading(false);
            return;
          }

          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/profile/me/${user_id}`;
          console.log("Making API call to:", apiUrl);

          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("API response:", data);
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          logout();
          if (!isPublicPath) {
            router.push("/login");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    };

    fetchUserId();
  }, [setUser, logout, pathname, router, loading]);

  return null;
}