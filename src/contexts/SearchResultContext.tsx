import { createContext, useReducer } from "react";
import { Dispatch } from "react";
import { dedupResponses } from "../helpers/helperFns";
import { initialSearchResult } from "../helpers/constants";

export const SearchResultContext = createContext(initialSearchResult);
export const SearchResultDispatchContext = createContext<Dispatch<any> | null>(
  null,
);

export function resultsReducer(state, action) {
  switch (action.type) {
    case "update result": {
      const placesArray = [...state.places, ...action.places];
      const uniquePlaces = dedupResponses(placesArray);

      return {
        ...state,
        places: uniquePlaces,
        next: action?.next || "",
        fourNextPage: action?.fourNextPage || "",
      };
    }
    case "clear": {
      return {
        places: [],
        next: "",
        fourNextPage: "",
      };
    }
    default:
      throw new Error("Unknown action.");
  }
}
