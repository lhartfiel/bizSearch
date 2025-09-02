import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkeletonWrapper } from "./SkeletonWrapper";

describe("SkeletonWrapper component", () => {
  it("should render a Skeleton with a title section", () => {
    render(<SkeletonWrapper />);
    const titleWrapper = screen.getByTestId("skeleton-title");
    const title = titleWrapper.querySelector("span");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("w-full");
  });

  it("should render a Skeleton with a body section", () => {
    render(<SkeletonWrapper />);
    const bodyWrapper = screen.getByTestId("skeleton-body");
    const skeletonLines = bodyWrapper.querySelectorAll("span > span");
    expect(skeletonLines).toHaveLength(2);
  });

  it("should render a Skeleton with a stars section", () => {
    render(<SkeletonWrapper />);
    const starWrapper = screen.getByTestId("skeleton-stars");
    const star = starWrapper.querySelector("span");
    expect(star).toBeInTheDocument();
    expect(star).toHaveClass("w-1/3");
  });

  it("should have a wrapper with a border radius of 8px", () => {
    render(<SkeletonWrapper />);
    const wrapper = screen.getByTestId("skeleton-wrapper");
    expect(wrapper).toHaveStyle({ borderRadius: "8px" });
  });
});
