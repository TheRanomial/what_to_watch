"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { FormEvent, Suspense, useRef, useState } from "react";
import Movie from "@/movie";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [moviePlots, setMoviePlots] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);

  function search(e: FormEvent) {
    e.preventDefault();
    const enteredSearch = searchInput.current?.value;
    setIsLoading(true);

    fetch(
      `/api/recommendations?search=${encodeURIComponent(enteredSearch || "")}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setMoviePlots(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  return (
    <>
      <section id="shorten">
        <div className="max-w-4xl mx-auto p-6 space-y-6 focus:bg-slate-950">
          <form onSubmit={search}>
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium sr-only text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                ref={searchInput}
                autoComplete="off"
                className="block w-full p-4 pl-10 text-sm border rounded-lg  bg-slate-950 border-gray-600 placeholder-gray-400 text-white"
                placeholder="Type what do you want to watch about"
                required
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 font-medium rounded-lg text-sm px-4 py-2 bg-black hover:bg-darkBlue "
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="flex gap-8 flex-wrap flex-col grow shrink items-start mx-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-32 w-32 mx-auto">
            {/* Embedding the SVG loading indicator */}
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : (
          moviePlots.map((item) => (
            <div
              key={item.title}
              className="relative p-10 text-white text-lg rounded-lg binline-block justify-start shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] items-start"
            >
              <div>
                <h4 className="opacity-90 text-xl">From {item.director}</h4>
                <p className="opacity-50 text-sm">Year {item.year}</p>
              </div>
              <h1 className="text-4xl font-semibold mt-6">{item.title}</h1>
              <p className="relative mt-6 text opacity-80 italic">
                {item.plot.slice(0, 500)}
              </p>
              <div>
                <p className="opacity-50 text-sm mt-6">
                  <a
                    href={item.wiki}
                    className="underline text-lg decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit"
                  >
                    {item.wiki}
                  </a>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
