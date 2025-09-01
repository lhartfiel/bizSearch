import { fetchGoogleResults } from "./fetchGoogleResults";
import { fetchFoursquareResults } from "./fetchFoursquareResults";
import { searchResultType, fetchResponseType } from "../helpers/constants";
import { dedupResponses } from "../helpers/helperFns";
import { ApiError } from "../components/ApiError";

/**
 * fetchMainResults
 *
 * This function is cumulative:
 * - It always merges existing results with newly fetched results
 * - Deduplicates merged results
 * - Returns a full combined dataset on every call
 */

export const fetchMainResults = async (
  name: string,
  location: string,
  nextResults: string,
  existingResults: searchResultType | undefined,
  setIsEmpty: (value: boolean) => void,
) => {
  let lastError: { status: number; message: string } | null = null;
  let nextGoogleToken = "";
  let fourNextPage = existingResults?.fourNextPage || "";
  const results: any[] = existingResults?.places || [];

  const handleResponse = (
    res: fetchResponseType,
    apiCall: "google" | "foursquare",
  ) => {
    if (res.error) {
      lastError = {
        status: res.error.status,
        message: res.error.statusText,
      };
    } else {
      results.push(...(res.places || []));
      if (apiCall === "google") {
        nextGoogleToken = "";
      } else if (apiCall === "foursquare") {
        fourNextPage = res.fourNextPage || "";
      }
    }
  };

  // Return first page of results from Google before fetching foursquare results
  if (!fourNextPage && nextResults === "initial") {
    const googleResponse = await fetchGoogleResults(name, location);
    handleResponse(googleResponse, "google");
  }

  /*
  If the results returned from the Google Response
  are less than the max, fetch more by calling Foursquare
  */
  if (!nextGoogleToken || lastError !== null) {
    const fsResults = await fetchFoursquareResults(
      name,
      location,
      existingResults,
    );

    handleResponse(fsResults, "foursquare");
  }

  const combinedResults = dedupResponses(results);

  if (lastError !== null && combinedResults.length === 0) {
    const err = lastError as { status: number; message: string };
    throw new ApiError(err.status, err.message);
  }

  setIsEmpty(combinedResults.length === 0);
  return {
    places: combinedResults,
    googleNextPage: nextGoogleToken,
    fourNextPage,
  };
};
