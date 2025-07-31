import { useEffect, useState, startTransition, memo, useId } from "react";
import { useForm } from "@tanstack/react-form";
import { Result } from "./Result";
import { SkeletonWrapper } from "./SkeletonWrapper";
import { InputField } from "./InputField";
import { initialSearchResult, MAX_RESULTS } from "../helpers/constants";
import { fetchMainResults } from "../api/fetchMainResults";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-form";

const SearchForm = memo(() => {
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [fetchMoreNum, setFetchMoreNum] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const uniqueId = useId();

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(["search", "initial"], initialSearchResult);
  }, [queryClient]);

  const {
    isLoading,
    isFetching,
    isError,
    data: searchResults = { places: [], googleNextPage: "", fourNextPage: "" },
  } = useQuery({
    queryKey: ["search", searchName, searchLocation],
    queryFn: () =>
      fetchMainResults(
        searchName,
        searchLocation,
        "initial",
        undefined,
        setIsEmpty,
      ),
    enabled: isSubmitted, // disable autofetching
    staleTime: 1000 * 60 * 30, // controls background refresh every 30 minutes
    gcTime: 1000 * 60 * 60, // keeps cache in memory for 1 hour
  });

  useEffect(() => {
    if (!isFetching && isSubmitted) {
      setIsSubmitted(false);
    }
  }, [isFetching, isSubmitted]);

  const handleInitialSearch = async (name: string, location: string) => {
    if (!name && !location) {
      return;
    }
    setIsEmpty(false);
    setFetchMoreNum(1);
    setSearchName(name);
    setSearchLocation(location);
    setIsSubmitted(true);

    // Store last search for index.tsx scroll logic
    queryClient.setQueryData(["lastSearch"], { name, location });
  };

  const handleMoreResults = async () => {
    setFetchMoreNum((prev) => prev + 1);

    await queryClient.fetchQuery({
      queryKey: ["search", searchName, searchLocation],
      queryFn: () =>
        fetchMainResults(
          searchName,
          searchLocation,
          searchResults?.googleNextPage,
          searchResults,
          setIsEmpty,
        ),
    });
  };

  const form = useForm({
    defaultValues: {
      name: "",
      location: "",
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        await handleInitialSearch(value.name, value.location);
      });
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

  const nameValue = useStore(form.store, (state) => state.values.name);
  const locationValue = useStore(form.store, (state) => state.values.location);

  useEffect(() => {
    // Clear the results when the user manually deletes the text in the input fields
    if (!nameValue || !locationValue) {
      setIsSubmitted(false);
      setSearchName("");
      setSearchLocation("");
    }
  }, [nameValue, locationValue]);

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
                setIsSubmitted(false);
                setIsEmpty(false);
                setSearchName(""); // clears current query
                setSearchLocation("");
                form.reset();
              }}
            >
              Reset
            </button>
          </div>
          <button
            className={`${!nameValue || !locationValue ? "hover:none bg-gray-400" : "hover:cursor-pointer bg-[image:var(--bg-button)] hover:bg-[image:var(--bg-button-hover)] hover:shadow-xl"} text-white  shadow-none transition duration-300  py-2 px-6 rounded-full w-full sm:w-[180px] font-bold uppercase`}
            disabled={!nameValue || !locationValue ? true : false}
            type="submit"
            onClick={form.handleSubmit}
          >
            Scout
          </button>
        </div>
      </form>
      <section className="grid col-span-12 grid-cols-subgrid">
        {isLoading &&
          Array.from({ length: 4 }).map((_, idx) => {
            return <SkeletonWrapper key={`${uniqueId}-${idx}`} />;
          })}
        {!isLoading &&
          searchResults?.places?.length > 0 &&
          searchResults?.places?.map((result, idx: number) => {
            if (idx + 1 <= MAX_RESULTS * fetchMoreNum) {
              return (
                <Result
                  result={result}
                  key={`${result?.phone}-${uniqueId}`}
                  index={idx}
                />
              );
            }
          })}
        {!isLoading && isEmpty && searchResults?.places?.length === 0 && (
          <h2 className="text-h2 block col-span-8 col-start-3 md:col-span-4 md:col-start-5 text-center text-bright-salmon">
            Oops! Looks like we couldn't find any search results. Please try
            again.
          </h2>
        )}
        {isError && <p>An error has been returned.</p>}
        {(searchResults?.googleNextPage?.length > 0 ||
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
