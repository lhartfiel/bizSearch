/// <reference types="@vitest/browser/context" />
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
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
