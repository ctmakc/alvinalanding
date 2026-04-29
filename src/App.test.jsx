import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the Alvina Usher landing page", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /mission-focused real estate/i
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /enquire now/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /initiate mission/i })).toBeInTheDocument();
  });
});
