import { useState, useEffect, useTransition } from "react";
import { useForm, formOptions, FieldInfo } from "@tanstack/react-form";
import { QueryClient } from "@tanstack/react-query";
import { Result } from "./Result";
import { SkeletonWrapper } from "./SkeletonWrapper";
import { InputField } from "./InputField";

interface searchResultType {
  places: any[];
  next: string;
  fourNextPage: string;
}

const initialSearchResult: searchResultType = {
  places: [],
  next: "",
  fourNextPage: "",
};

const MAX_RESULTS = 25; // Max results per page

const SearchForm = () => {
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchResults, setSearchResults] =
    useState<searchResultType>(initialSearchResult);
  const [fetchMoreNum, setFetchMoreNum] = useState(1);
  const [isPending, startTransition] = useTransition();

  const queryClient = new QueryClient();
  const searchResultsNumber = searchResults.places.length;

  const dedupResponses = (responses) => {
    return responses.filter((obj, index, self) => {
      return index === self.findIndex((t) => t.phone === obj.phone);
    });
  };

  const cleanedPhoneNum = (num) => {
    return num?.replace(/[^\d+]/g, "");
  };

  const fetchGoogleResults = async (name, location, initialNext) => {
    const nextParam = initialNext === "initial" ? 0 : searchResults.next.length;
    console.log("nextParam", nextParam, typeof nextParam);
    const googleUrl =
      nextParam && nextParam !== 0 ? `&pagetoken=${searchResults.next}` : "";
    console.log("googleUrl", googleUrl);
    const googleTerm = name + location;
    const googleRes = await fetch(
      `/api/googleSearch?searchTerm=${encodeURIComponent(googleTerm)}${googleUrl}`,
    );

    if (!googleRes.ok) {
      const text = await googleRes.text();
      console.error("Fetch failed:", text);
      throw new Error("Failed to fetch");
    }

    const googleJson = await googleRes.json();
    console.log("RES", googleJson);
    const googleNewObj = googleJson.places.map((item) => {
      const num = cleanedPhoneNum(item?.nationalPhoneNumber);

      if (!item.formattedAddress && !item?.displayName.text) {
        // Don't return any results that don't have an address or name
        return;
      }
      return {
        address: item?.formattedAddress,
        directions: item?.googleMapsLinks?.directionsUri,
        name: item?.displayName.text,
        phone: num,
        price: item?.priceRange,
        rating: item?.rating,
        ratingCount: item?.userRatingCount,
        summary: item?.generativeSummary?.overview?.text,
        webUrl: item?.websiteUri,
      };
    });
    return { googleNewObj, googleJson };
  };

  const fetchFoursquareResults = async (name, location) => {
    console.log("NEXT", searchResults?.fourNextPage);
    const foursquareUrl =
      searchResults?.fourNextPage !== null
        ? `&fourNextPage=${searchResults.fourNextPage}`
        : "";
    const foursquareRes = await fetch(
      `/api/foursquareSearch?name=${encodeURIComponent(name)}&location=${location}${foursquareUrl}`,
    );
    const foursquareJson = await foursquareRes.json();
    console.log("foursquareJson", foursquareJson);
    const foursquareNewObj = foursquareJson.results.map((item) => {
      const num = cleanedPhoneNum(item?.tel);

      if (!item.location.formatted_address && !item.name) {
        return;
      }

      return {
        name: item?.name,
        address: item?.location.formatted_address,
        phone: num,
        rating: item?.rating,
        webUrl: item?.website,
      };
    });
    setSearchResults((prev) => {
      const placesArray = [...prev.places, ...foursquareNewObj];
      const uniquePlaces = dedupResponses(placesArray);
      const newArray = {
        places: uniquePlaces || [],
        next: "",
        fourNextPage: foursquareJson.nextPageToken || "",
      };
      return newArray;
    });
  };

  const fetchMainResults = async (name, location, nextResults) => {
    const results = await fetchGoogleResults(name, location, nextResults);

    setSearchResults((prev) => {
      const placesArray = [...prev.places, ...results.googleNewObj];
      const uniquePlaces = dedupResponses(placesArray);
      const newArray = {
        places: uniquePlaces || [],
        next: results.googleJson.nextPageToken,
      };
      return newArray;
    });

    // If the results returned from the Google Response are less than the max, fetch more by calling Foursquare
    if (results?.googleNewObj?.length < MAX_RESULTS) {
      await fetchFoursquareResults(name, location);
    }
  };

  const fetchInitialResults = async (name, location, nextParams) => {
    try {
      // ALWAYS fetch the initial Google results, which only return a max of 20
      await fetchMainResults(name, location, nextParams);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTermResults = async (name, location) => {
    // TODO: Extract all API calls to separate file
    try {
      if (searchResults.next) {
        // If there is a next page token, fetch the next page of results from Google
        console.log("fetch goog");
        await fetchMainResults(name, location, searchResults.next);
      } else {
        console.log("fetch foursq");
        await fetchFoursquareResults(name, location);
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

  console.log("searchResults", searchResults);

  const form = useForm({
    defaultValues: {
      name: "",
      location: "",
    },
    onSubmit: async ({ value }) => {
      setSearchResults(initialSearchResult);

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
                startTransition(() => {
                  setSearchResults(initialSearchResult);
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
          searchResults?.places.map((result, idx) => {
            if (idx + 1 <= MAX_RESULTS * fetchMoreNum) {
              return <Result result={result} key={result?.phone} index={idx} />;
            }
          })}
        {(searchResults.next?.length > 0 ||
          searchResults.fourNextPage?.length > 0 ||
          searchResults.places.length > MAX_RESULTS * fetchMoreNum) && (
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
};

export { SearchForm };
