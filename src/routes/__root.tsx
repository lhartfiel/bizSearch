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
import { ModalContext, ModalDispatchContext } from "../contexts/ModalContext";
import { useReducer } from "react";
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

function themeReducer(theme: string) {
  switch (theme) {
    case "light":
      return "dark";
    case "dark":
      return "light";
    default:
      return theme;
  }
}

function modalReducer(modalValue: boolean) {
  return !modalValue;
}

function RootComponent() {
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </RootDocument>
  );
}

const initialTheme = "light";
const initialModal = false;

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const [theme, themeDispatch] = useReducer(themeReducer, initialTheme);
  const [modal, modalDispatch] = useReducer(modalReducer, initialModal);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={themeDispatch}>
        <ModalContext.Provider value={modal}>
          <ModalDispatchContext.Provider value={modalDispatch}>
            <html className={`${theme === "dark" ? "dark" : ""}`}>
              <head>
                <HeadContent />
              </head>
              <body>
                {children}
                <Scripts />
              </body>
            </html>
          </ModalDispatchContext.Provider>
        </ModalContext.Provider>
      </ThemeDispatchContext.Provider>
    </ThemeContext.Provider>
  );
}
