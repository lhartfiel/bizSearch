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
import { useEffect, useReducer } from "react";

const queryClient = new QueryClient();

function useHtmlLang(lang: string) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
}

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
        name: "description",
        content:
          "A business search application returning info based name and geographic location",
      },
      {
        title: "Business Search",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Akatab:wght@400;500;600;700;800;900&family=Borel&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap",
      },
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
  useHtmlLang("en");
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
