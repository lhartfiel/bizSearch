import { useEffect, useState, startTransition, memo, useId } from "react";
import { useForm } from "@tanstack/react-form";
import { Result } from "./Result";
import { SkeletonWrapper } from "./SkeletonWrapper";
import { InputField } from "./InputField";
import { initialSearchResult, MAX_RESULTS } from "../helpers/constants";
import { fetchMainResults } from "../api/fetchMainResults";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-form";
import { Button } from "./Button";

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
            customClasses={`${!nameValue || !locationValue ? "opacity-50 hover:shadow-none! hover:bg-[image:var(--bg-button)]! hover:cursor-not-allowed!" : "hover:cursor-pointer hover:bg-[image:var(--bg-button-hover)] hover:shadow-xl opacity-100"}`}
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
          <Button
            buttonSize="lg"
            buttonText="Load More"
            callback={handleMoreResults}
          />
        )}
      </section>
    </>
  );
});

export { SearchForm };
