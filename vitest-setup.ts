/// <reference types="@vitest/browser/context" />
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./src/mocks/server";
import { vi } from "vitest";
import React from "react";

// Mock FontAwesome so it returns a simple span
vi.mock("@fortawesome/react-fontawesome", () => {
  return {
    FontAwesomeIcon: (props: any) => React.createElement("span", props),
  };
});

afterEach(() => {
  cleanup();
});

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset any runtime request handlers we add during the tests
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Clean up once all tests are done
afterAll(() => server.close());
