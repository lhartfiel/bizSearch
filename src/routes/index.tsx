// src/routes/index.tsx
import { useContext } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SearchForm } from "../components/SearchForm";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Footer } from "../components/Footer";
import { Modal } from "../components/Modal";
import { ModalContext } from "../contexts/ModalContext";

const iconUp = <FontAwesomeIcon className="text-white" icon={faAngleUp} />;

export const Route = createFileRoute("/")({
  component: Home,
});

function useElementScrollPosition(ref: React.RefObject<HTMLDivElement | null>) {
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      setScrollPos(el.scrollTop);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    // Clean up scroll event
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);

  return scrollPos;
}

function Home() {
  const showModal = useContext(ModalContext);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const scrollYPos = useElementScrollPosition(elementRef);
  const queryClient = useQueryClient();

  const lastSearch = queryClient.getQueryData<{
    name: string;
    location: string;
  }>(["lastSearch"]);
  const searchResults = lastSearch
    ? queryClient.getQueryData([
        "search",
        lastSearch.name + lastSearch.location,
      ])
    : null;

  useEffect(() => {
    const checkScrollbar = () => {
      if (elementRef.current) {
        const isScrollable =
          elementRef.current.scrollHeight > elementRef.current.clientHeight;
        setHasScrollbar(isScrollable);
      }
    };

    checkScrollbar();

    window.addEventListener("resize", checkScrollbar);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", checkScrollbar);
    };
  }, [searchResults]);

  const scrollToTop = () => {
    if (elementRef.current) {
      elementRef.current.scrollTo({
        top: 100,
        left: 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <article
      ref={elementRef}
      className="light-gradient dark-gradient flex flex-wrap justify-center items-between text-center h-full min-h-screen h-screen overflow-y-auto"
    >
      {<Modal showModal={showModal} />}
      {/* {showModal && <Modal />} */}
      <span className="lg:mx-auto lg:max-w-7xl xxl:max-w-[1440px] w-full px-6 py-8 ">
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
        {hasScrollbar &&
          elementRef.current &&
          scrollYPos > elementRef?.current.clientHeight && (
            <button
              onClick={scrollToTop}
              className="absolute right-0 mr-2 md:right-4 md:mr-6 bottom-4 flex items-center justify-center w-9 h-9 bg-bright-salmon rounded-full shadow-lg hover:shadow-card hover:cursor-pointer"
            >
              {iconUp}
            </button>
          )}
      </span>
      <Footer />
    </article>
  );
}
