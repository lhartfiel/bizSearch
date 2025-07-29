import { useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { QueryClient } from "@tanstack/react-query";
import { Result } from "./Result";
import { SkeletonWrapper } from "./SkeletonWrapper";
import { InputField } from "./InputField";
import { MAX_RESULTS } from "../helpers/constants";
import { fetchMainResults } from "../api/fetchMainResults";
import { fetchFoursquareResults } from "../api/fetchFoursquareResults";
import { useContext } from "react";
import {
  SearchResultContext,
  SearchResultDispatchContext,
} from "../contexts/SearchResultContext";
import { initialSearchResult } from "../helpers/constants";
import { memo } from "react";

const SearchForm = memo(() => {
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [fetchMoreNum, setFetchMoreNum] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isEmpty, setIsEmpty] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchResults = useContext(SearchResultContext);
  const dispatch = useContext(SearchResultDispatchContext);

  const queryClient = new QueryClient();

  const fetchInitialResults = async (
    name: string,
    location: string,
    nextParams: string,
  ) => {
    try {
      // ALWAYS fetch the initial Google results, which only return a max of 20
      await fetchMainResults(
        name,
        location,
        nextParams,
        dispatch,
        searchResults,
        setIsEmpty,
      );
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTermResults = async (name: string, location: string) => {
    try {
      if (searchResults.next) {
        // If there is a next page token, fetch the next page of results from Google
        await fetchMainResults(
          name,
          location,
          searchResults.next,
          dispatch,
          searchResults,
        );
      } else {
        await fetchFoursquareResults(name, location, dispatch, searchResults);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoreResults = async () => {
    setFetchMoreNum((prev) => prev + 1);
    if (searchResults.next.length || searchResults.fourNextPage.length) {
      await fetchTermResults(searchName, searchLocation);
    }
  };

  const form = useForm({
    defaultValues: {
      name: "",
      location: "",
    },
    onSubmit: async ({ value }) => {
      setIsEmpty(false);
      setHasSearched(true);
      dispatch({
        type: "clear",
      });
      try {
        setSearchName(value.name);
        setSearchLocation(value.location);
        startTransition(async () => {
          await queryClient.fetchQuery({
            queryKey: ["search", value.name + value.location],
            queryFn: () =>
              fetchInitialResults(value.name, value.location, "initial"),
          });
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const inputs = [
    {
      name: "name",
      label: "Name (Coffee, Dunkin Donuts)",
      placeholder: "Enter Name",
    },
    {
      name: "location",
      label: "Location (Chicago)",
      placeholder: "Enter Location",
    },
  ];

  console.log("search RES", searchResults, searchResults?.places?.length);
  console.log("pending", isPending);
  console.log("empty", isEmpty);

  return (
    <>
      <form
        className="font-akatab col-span-12 lg:col-span-12 grid grid-cols-subgrid w-full justify-center items-center mb-9"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {inputs.map((input) => {
          return (
            <InputField
              name={input.name}
              key={input.name}
              label={input.label}
              placeholder={input.placeholder}
              form={form}
            />
          );
        })}
        <div className="col-span-12 flex flex-wrap gap-4 justify-center w-full mt-5">
          <div className="button-wrapper btn-gradient rounded-full w-full sm:w-auto p-[2px]">
            <button
              className="hover:cursor-pointer bg-white bg-red-500 dark:bg-gradient-dark-start py-2 px-6 rounded-full shadow-none transition-shadow duration-300 hover:shadow-xl w-full sm:w-[180px] dark:text-white font-bold uppercase"
              type="reset"
              onClick={(event) => {
                event.preventDefault();
                setIsEmpty(false);
                setHasSearched(false);
                startTransition(() => {
                  dispatch({
                    type: "clear",
                    places: initialSearchResult.places,
                    next: initialSearchResult.next,
                    fourNextPage: initialSearchResult.fourNextPage,
                  });
                });
                form.reset();
              }}
            >
              Reset
            </button>
          </div>
          <button
            className="text-white bg-[image:var(--bg-button)] hover:bg-[image:var(--bg-button-hover)] shadow-none transition duration-300 hover:shadow-xl hover:cursor-pointer py-2 px-6 rounded-full w-full sm:w-[180px] font-bold uppercase"
            type="submit"
            onClick={form.handleSubmit}
          >
            Scout
          </button>
        </div>
      </form>
      <section className="grid col-span-12 grid-cols-subgrid">
        {isPending &&
          Array.from({ length: 4 }).map((_, idx) => {
            return <SkeletonWrapper />;
          })}
        {!isPending &&
          searchResults?.places?.length > 0 &&
          searchResults?.places.map((result, idx: number) => {
            if (idx + 1 <= MAX_RESULTS * fetchMoreNum) {
              return <Result result={result} key={result?.phone} index={idx} />;
            }
          })}
        {!isPending && hasSearched && searchResults.places.length === 0 && (
          <h2 className="text-h2 block col-span-8 col-start-3 md:col-span-4 md:col-start-5 text-center text-bright-salmon">
            Oops! Looks like we couldn't find any search results. Please try
            again.
          </h2>
        )}
        {(searchResults?.next?.length > 0 ||
          searchResults?.fourNextPage?.length > 0 ||
          (searchResults?.places &&
            searchResults?.places.length > MAX_RESULTS * fetchMoreNum)) && (
          <button
            className="w-full col-span-2 col-start-6 mt-4 text-white bg-[image:var(--bg-button)] hover:bg-[image:var(--bg-button-hover)] shadow-none transition duration-300 hover:shadow-xl hover:cursor-pointer py-4 px-8 rounded-full font-bold uppercase"
            onClick={handleMoreResults}
          >
            Load More
          </button>
        )}
      </section>
    </>
  );
});

export { SearchForm };
