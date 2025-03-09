"use client"
import { useSession, signOut } from "next-auth/react";
import React from "react";
export default function ProfileMenu() {
  const { data: session } = useSession();

  return (
    <div className="relative">
      <button className="px-4 py-2 bg-gray-200 rounded-md">
        {session?.user?.name || "Profile"}
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
        <p className="text-sm text-gray-700">{session?.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="w-full mt-2 p-2 bg-red-500 text-white rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
