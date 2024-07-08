"use client";

import Image from "next/image";
import { Inter } from "next/font/google";


import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <main className="text-center">
        <h1 className="text-6xl text-[#C4CBCA] font-bold mb-10">
          Welcome to WhatToWatch
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Search what you want to watch
        </p>

        <div className="flex justify-between space-x-4">
          <Link
            href={"/movies"}
            className="bg-[#C4CBCA] hover:bg-green-400 text-black font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-300"
          >
            Movies
          </Link>
          <Link
            href={"/anime"}
            className="bg-[#C4CBCA] hover:bg-green-400 text-black font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-300"
          >
            Anime
          </Link>
        </div>
      </main>
    </div>
  );
}
