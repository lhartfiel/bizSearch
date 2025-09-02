import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SearchResultCard } from "./SearchResultCard";
import * as utils from "../helpers/utils";
import userEvent from "@testing-library/user-event";

const mockResult = {
  address: "123 Main St, Anytown, USA",
  name: "Test Place",
  phone: "(123) 456-7890",
  rating: "4.5",
  ratingCount: 150,
  webUrl: "http://www.testplace.com",
};

describe("SearchResultCard component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return an div when a url is provided and touch is false", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(false);

    render(<SearchResultCard result={mockResult} />);
    const linkWrapper = screen.getByTestId("card-wrapper");
    expect(linkWrapper).toBeInTheDocument();
    expect(linkWrapper).toHaveAttribute("href", mockResult.webUrl);
    expect(linkWrapper).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(true);

    render(<SearchResultCard result={mockResult} />);
    const linkWrapper = screen.getByTestId("card-wrapper");
    expect(linkWrapper).toBeInTheDocument();
    expect(linkWrapper).not.toHaveAttribute("href");
    expect(linkWrapper.tagName).toBe("DIV");
  });

  it("should display an h2 heading with the name", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(false);
    render(<SearchResultCard result={mockResult} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(mockResult.name);
  });

  it("should display an address if provided", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(false);
    render(<SearchResultCard result={mockResult} />);
    const address = screen.getByTestId("card-address");
    const locationIcon = screen.getByTestId("address-icon");
    expect(locationIcon).toBeInTheDocument();
    expect(address).toBeInTheDocument();
    expect(address).toHaveTextContent(mockResult.address);
  });

  it("should not display an address if empty", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(false);
    render(<SearchResultCard result={{ ...mockResult, address: "" }} />);
    const address = screen.queryByTestId("card-address");
    expect(address).not.toBeInTheDocument();
  });

  it("should display a phone number if provided", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(false);
    render(<SearchResultCard result={mockResult} />);
    const phone = screen.getByTestId("card-phone");
    expect(phone).toBeInTheDocument();
  });

  it("should display 'N/A' for phone number if empty", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(false);
    render(<SearchResultCard result={{ ...mockResult, phone: "" }} />);
    const phone = screen.queryByTestId("card-phone");
    expect(phone).toBeInTheDocument();
    expect(phone).toHaveTextContent("N/A");
  });

  it("should display the rating if provided", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(false);
    render(<SearchResultCard result={mockResult} />);
    const rating = screen.queryByTestId("card-rating");
    expect(rating).toBeInTheDocument();
  });

  it("should not display the rating if empty", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(false);
    render(<SearchResultCard result={{ ...mockResult, rating: "" }} />);
    const rating = screen.queryByTestId("card-rating");
    expect(rating).not.toBeInTheDocument();
  });

  it("should not display the button if touch device and web url", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(true);
    render(<SearchResultCard result={mockResult} />);
    const button = screen.getByRole("button", { name: "Website link" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("role", "button");
  });

  it("should not display the button if touch device but no web url", () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(true);
    render(<SearchResultCard result={{ ...mockResult, webUrl: "" }} />);
    const webIcon = document.querySelector("span");
    const button = screen.queryByRole("button", { name: "Website link" });
    expect(button).not.toBeInTheDocument();
    expect(webIcon).toBeInTheDocument();
  });

  it("should trigger a click even when web icon is clicked", async () => {
    vi.spyOn(utils, "isTouchDevice").mockReturnValue(true);
    render(<SearchResultCard result={mockResult} />);
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const button = screen.getByRole("button", { name: "Website link" });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(openSpy).toHaveBeenCalledWith(mockResult.webUrl, "_blank");
  });
});
