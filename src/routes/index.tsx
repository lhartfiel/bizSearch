// src/routes/index.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { SearchForm } from "../components/SearchForm";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <article className="light-gradient dark-gradient flex flex-wrap justify-center items-start text-center min-h-screen">
      <span className="lg:mx-auto lg:max-w-7xl xxl:max-w-[1440px] w-full mx-6 py-8">
        <ThemeSwitch />
        <section className="mb-8">
          <h1 className="w-full text-gradient font-nunito text-h1-sm md:text-h1-md lg:text-h1 leading-h1-mobile md:leading-h1 font-bold drop-shadow-main leading-[124px]">
            Scout it out
          </h1>
          <h2 className="font-borel text-h2 md:text-h2-subhead md:leading-h2-subhead leading-h2 dark:text-white">
            Search. Scout. Scour.
          </h2>
        </section>
        <section className="grid grid-cols-12 w-full gap-6">
          <SearchForm />
        </section>
      </span>
    </article>
  );
}
