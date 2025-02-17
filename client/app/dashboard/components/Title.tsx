"use client"
import useAuthStore from "@/store/useAuthStore";

 
export default function Title(  ) {
  const { user: authUser } = useAuthStore();
  console.log(authUser)
  return (
    <h1 className="py-4 text-black font-medium text-xl">
      Hello {authUser?.username} 👋 <br /> Let’s travelling the <span className="text-orange-400">World Together!</span>
    </h1>
  );
}
