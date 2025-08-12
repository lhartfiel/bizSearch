import { useEffect, useState, startTransition, memo, useId } from "react";
import { useForm } from "@tanstack/react-form";
import { SearchResultCard } from "./SearchResultCard";
import { SkeletonWrapper } from "./SkeletonWrapper";
import { InputField } from "./InputField";
import {
  initialSearchResult,
  MAX_RESULTS,
  searchResultPlacesType,
} from "../helpers/constants";
import { fetchMainResults } from "../api/fetchMainResults";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-form";
import { Button } from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { SearchTable } from "./SearchTable";
import { SearchResultViews } from "./SearchResultViews";

const alertIcon = (
  <FontAwesomeIcon
    icon={faCircleExclamation}
    className="text-bright-salmon text-h2 mr-2"
  />
);

const SearchForm = memo(() => {
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [fetchMoreNum, setFetchMoreNum] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [view, setView] = useState("card");
  const uniqueId = useId();

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(["search", "initial"], initialSearchResult);
  }, [queryClient]);

  const {
    isLoading,
    isFetching,
    error,
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
    retry: (failureCount, error) => {
      const status = (error as any)?.status;
      if (status) {
        if (status === 404) return false; // no retry on 404
        if (status >= 400 && status < 500 && status !== 429) return false; // no retry on client errors except 429
      }
      return failureCount < 2; // retry twice on server errors or unknown status
    },
  });

  useEffect(() => {
    // Set isSubmitted to false once data is finished being fetched
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
    setIsLoadingMore(true);
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
    setIsLoadingMore(false);
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
      label: "Location (Chicago, IL)",
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

  interface ResetEvent
    extends React.SyntheticEvent<HTMLButtonElement | HTMLFormElement> {}

  const handleReset = (event: ResetEvent): void => {
    event.preventDefault();
    setIsSubmitted(false);
    setIsEmpty(false);
    setSearchName(""); // clears current query
    setSearchLocation("");
    form.reset();
  };

  const handleViewChange = (value: string) => {
    setView(value);
  };
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
          <div
            className={`${!nameValue || !locationValue ? "opacity-50" : "opacity-100"} button-wrapper btn-gradient rounded-full w-full sm:w-auto p-[2px]`}
          >
            <Button
              buttonText="Reset"
              buttonType="secondary"
              customClasses={`${!nameValue || !locationValue ? "hover:cursor-not-allowed" : "hover:shadow-xl hover:cursor-pointer"} bg-white dark:bg-gradient-dark-start dark:text-white`}
              disabled={!nameValue || !locationValue ? true : false}
              type="reset"
              callback={handleReset}
            />
          </div>
          <Button
            buttonText="Scout"
            customClasses={`${!nameValue || !locationValue ? "opacity-50 hover:shadow-none! hover:bg-[image:var(--bg-button)]! hover:cursor-not-allowed!" : "transition-all duration-500 ease-in-out bg-size-[200%_100%] bg-position-[100%_0] hover:bg-position-[0_0] hover:shadow-xl opacity-100"}`}
            disabled={!nameValue || !locationValue ? true : false}
            type="submit"
            callback={form.handleSubmit}
          />
        </div>
      </form>
      <section className="grid col-span-12 grid-cols-subgrid">
        {isLoading &&
          Array.from({ length: 4 }).map((_, idx) => {
            return <SkeletonWrapper key={`${uniqueId}-${idx}`} />;
          })}
        {!isLoading && searchResults?.places?.length > 0 && (
          <>
            <SearchResultViews
              handleViewChange={handleViewChange}
              view={view}
            />
            {view === "table" && <SearchTable result={searchResults.places} />}

            {view === "card" && (
              <div className="grid col-span-12 grid-cols-subgrid mt-4">
                {searchResults?.places?.map(
                  (result: searchResultPlacesType, idx: number) => {
                    if (idx + 1 <= MAX_RESULTS * fetchMoreNum) {
                      return (
                        <SearchResultCard
                          result={result}
                          key={`${result?.phone}-${uniqueId}`}
                        />
                      );
                    }
                  },
                )}
              </div>
            )}
          </>
        )}
        {!isLoading && isEmpty && searchResults?.places?.length === 0 && (
          <h2 className="text-h2-sm md:text-h2 block col-span-8 col-start-3 md:col-span-4 md:col-start-5 text-center text-dark-blue">
            Aw, shucks! We couldn't find any search results for that criteria.{" "}
            <br />
            <span className="block mt-3">Please search again.</span>
          </h2>
        )}
        {isError && (
          <p className="flex items-center justify-center text-center col-span-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 text-dark-blue dark:text-white">
            {alertIcon}
            {error.message}
          </p>
        )}
        {(searchResults?.googleNextPage?.length > 0 ||
          searchResults?.fourNextPage?.length > 0 ||
          (searchResults?.places &&
            searchResults?.places.length > MAX_RESULTS * fetchMoreNum)) && (
          <Button
            buttonSize="lg"
            buttonText={isLoadingMore ? "Loading..." : "Load More"}
            customClasses={`${isLoadingMore && "opacity-50 hover:shadow-none! hover:bg-[image:var(--bg-button)]! hover:cursor-not-allowed!"} transition-all duration-400 ease-in-out bg-size-[200%_100%] bg-position-[100%_0] hover:bg-position-[0_0]`}
            callback={handleMoreResults}
            disabled={isLoadingMore}
          />
        )}
      </section>
    </>
  );
});

export { SearchForm };
