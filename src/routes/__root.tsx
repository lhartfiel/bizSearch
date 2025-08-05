// src/routes/__root.tsx
/// <reference types="vite/client" />
import appCss from "../styles/app.css?url";
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { NotFound } from "../components/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeContext, ThemeDispatchContext } from "../contexts/ThemeContext";
import { useReducer } from "react";
import {
  SearchResultContext,
  SearchResultDispatchContext,
} from "../contexts/SearchResultContext";
import { resultsReducer } from "../contexts/SearchResultContext";
import { initialSearchResult } from "../helpers/constants";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Business Search",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "shortcut icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function themeReducer(theme, action) {
  switch (theme) {
    case "light":
      return "dark";
    case "dark":
      return "light";
    default:
      return theme;
  }
}

function RootComponent() {
  const [results, dispatch] = useReducer(resultsReducer, initialSearchResult);
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <SearchResultContext.Provider value={results}>
          <SearchResultDispatchContext.Provider value={dispatch}>
            <Outlet />
          </SearchResultDispatchContext.Provider>
        </SearchResultContext.Provider>
      </QueryClientProvider>
    </RootDocument>
  );
}

const initialTheme = "light";

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const [theme, dispatch] = useReducer(themeReducer, initialTheme);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={dispatch}>
        <html className={`${theme === "dark" ? "dark" : ""}`}>
          <head>
            <HeadContent />
          </head>
          <body>
            {children}
            <Scripts />
          </body>
        </html>
      </ThemeDispatchContext.Provider>
    </ThemeContext.Provider>
  );
}
